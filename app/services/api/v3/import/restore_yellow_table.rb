module Api
  module V3
    module Import
      class RestoreYellowTable
        def initialize(table_class)
          @table_class = table_class
          @table = table_class.table_name
          @columns_cs = table_class.column_names_cs
          @backup_table = @table_class.full_backup_table
        end

        # Returns count of inserted rows
        def call
          Rails.logger.debug "Restoring #{@table}"
          restore
        end

        private

        def restore
          update_keys_in_full_backup
          @table_class.connection.execute("DELETE FROM #{@table}")
          stmt = <<~SQL
            INSERT INTO #{@table}
            (#{@columns_cs})
            SELECT #{@columns_cs}
            FROM #{@backup_table}
          SQL
          result = @table_class.connection.execute(stmt)
          result.cmd_tuples
        end

        def update_keys_in_full_backup
          if @table_class.yellow_foreign_keys.any?
            delete_rows_without_match_in_yellow_tables
          end
          return unless @table_class.blue_foreign_keys.any?

          delete_rows_without_match_in_blue_tables
          update_blue_foreign_keys
        end

        def delete_obsolete_rows(subquery_for_delete, where_conditions)
          stmt = <<~SQL
            DELETE FROM #{@backup_table}
            USING (#{subquery_for_delete}) updated_identifiers
            WHERE #{@backup_table}.id = updated_identifiers.id
            AND #{where_conditions.join(' OR ')}
          SQL
          @table_class.connection.execute stmt
        end

        def delete_rows_without_match_in_blue_tables
          select_list = []
          joins = []
          delete_where_conditions = []
          @table_class.blue_foreign_keys.each.with_index do |fk, idx|
            table_alias = "t_#{idx}"
            select_list << "#{table_alias}.new_id AS new_#{fk[:name]}"
            joins << <<~SQL
              LEFT JOIN #{fk[:table_class].key_backup_table} #{table_alias}
              ON #{table_alias}.id = t.#{fk[:name]}
            SQL
            delete_where_conditions << "#{@backup_table}.#{fk[:name]} IS NOT NULL AND new_#{fk[:name]} IS NULL" # no nullable columns
          end

          subquery_for_delete = <<~SQL
            SELECT t.*, #{select_list.join(', ')}
            FROM #{@backup_table} t
            #{joins.join(' ')}
          SQL
          delete_obsolete_rows(subquery_for_delete, delete_where_conditions)
        end

        def delete_rows_without_match_in_yellow_tables
          select_list = []
          joins = []
          delete_where_conditions = []
          @table_class.yellow_foreign_keys.each.with_index do |fk, idx|
            table_alias = "t_#{idx}"
            select_list << "#{table_alias}.id AS new_#{fk[:name]}"
            joins << <<~SQL
              LEFT JOIN #{fk[:table_class].table_name} #{table_alias}
              ON #{table_alias}.id = t.#{fk[:name]}
            SQL
            delete_where_conditions << "new_#{fk[:name]} IS NULL" # no nullable columns
          end

          subquery_for_delete = <<~SQL
            SELECT t.*, #{select_list.join(', ')}
            FROM #{@backup_table} t
            #{joins.join(' ')}
          SQL
          delete_obsolete_rows(subquery_for_delete, delete_where_conditions)
        end

        def update_blue_foreign_keys
          select_list = []
          joins = []
          update_set_expressions = []
          @table_class.blue_foreign_keys.each.with_index do |fk, idx|
            table_alias = "t_#{idx}"
            select_list << "#{table_alias}.new_id AS new_#{fk[:name]}"
            joins << <<~SQL
              JOIN #{fk[:table_class].key_backup_table} #{table_alias}
              ON #{table_alias}.id = t.#{fk[:name]}
            SQL
            update_set_expressions << "#{fk[:name]} = updated_identifiers.new_#{fk[:name]}"
          end

          subquery_for_update = <<~SQL
            SELECT t.*, #{select_list.join(', ')}
            FROM #{@backup_table} t
            #{joins.join(' ')}
          SQL

          stmt = <<~SQL
            UPDATE #{@backup_table}
            SET #{update_set_expressions.join(', ')}
            FROM (#{subquery_for_update}) updated_identifiers
            WHERE #{@backup_table}.id = updated_identifiers.id
          SQL
          @table_class.connection.execute stmt
        end
      end
    end
  end
end
