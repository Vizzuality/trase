module Api
  module V3
    module Import
      module YellowTableHelpers
        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods
          def full_backup
            connection.execute "DROP TABLE IF EXISTS #{full_backup_table}"
            stmt = <<~SQL
              CREATE TEMPORARY TABLE #{full_backup_table} AS
              SELECT #{column_names_cs}
              FROM #{table_name}
            SQL
            connection.execute stmt
          end

          def restore
            update_keys_in_full_backup
            stmt = <<~SQL
              TRUNCATE #{table_name} CASCADE;
              INSERT INTO #{table_name}
              (#{column_names_cs})
              SELECT #{column_names_cs}
              FROM #{full_backup_table}
            SQL
            connection.execute stmt
          end

          protected

          def full_backup_table
            'bkp_' + table_name
          end

          private

          def update_keys_in_full_backup
            if yellow_foreign_keys.any?
              delete_rows_without_match_in_yellow_tables
            end
            return unless blue_foreign_keys.any?
            delete_rows_without_match_in_blue_tables
            update_blue_foreign_keys
          end

          def delete_obsolete_rows(subquery_for_delete, where_conditions)
            stmt = <<~SQL
              DELETE FROM #{full_backup_table}
              USING (#{subquery_for_delete}) updated_identifiers
              WHERE #{full_backup_table}.id = updated_identifiers.id
              AND #{where_conditions.join(' AND ')}
            SQL
            connection.execute stmt
          end

          def delete_rows_without_match_in_blue_tables
            select_list = []
            joins = []
            delete_where_conditions = []
            blue_foreign_keys.each.with_index do |fk, idx|
              table_alias = "t_#{idx}"
              select_list << "#{table_alias}.new_id AS new_#{fk[:name]}"
              joins << <<~SQL
                LEFT JOIN #{fk[:table_class].key_backup_table} #{table_alias}
                ON #{table_alias}.id = t.#{fk[:name]}
              SQL
              delete_where_conditions << "new_#{fk[:name]} IS NULL" # no nullable columns
            end

            subquery_for_delete = <<~SQL
              SELECT t.*, #{select_list.join(', ')}
              FROM #{full_backup_table} t
              #{joins.join(' ')}
            SQL
            delete_obsolete_rows(subquery_for_delete, delete_where_conditions)
          end

          def delete_rows_without_match_in_yellow_tables
            select_list = []
            joins = []
            delete_where_conditions = []
            yellow_foreign_keys.each.with_index do |fk, idx|
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
              FROM #{full_backup_table} t
              #{joins.join(' ')}
            SQL
            delete_obsolete_rows(subquery_for_delete, delete_where_conditions)
          end

          def update_blue_foreign_keys
            select_list = []
            joins = []
            update_set_expressions = []
            blue_foreign_keys.each.with_index do |fk, idx|
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
              FROM #{full_backup_table} t
              #{joins.join(' ')}
            SQL

            stmt = <<~SQL
              UPDATE #{full_backup_table}
              SET #{update_set_expressions.join(', ')}
              FROM (#{subquery_for_update}) updated_identifiers
              WHERE #{full_backup_table}.id = updated_identifiers.id
            SQL
            connection.execute stmt
          end

          def yellow_foreign_keys; []; end
        end
      end
    end
  end
end
