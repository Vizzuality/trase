module Api
  module V3
    module Import
      module Helpers
        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods
          def full_backup
            connection.execute "DROP TABLE IF EXISTS #{full_backup_table}"
            stmt =<<-SQL
              CREATE TEMPORARY TABLE #{full_backup_table} AS
              SELECT #{column_names_cs}
              FROM #{table_name}
            SQL
            connection.execute stmt
          end

          def key_backup
            return unless import_key.any?
            connection.execute "DROP TABLE IF EXISTS #{key_backup_table}"

            remote_join_condition = []
            mapping_joins = []

            import_key.each.with_index do |key, idx|
              unstable_fk = unstable_foreign_keys.find { |fk| fk[:name] == key[:name] }
              if unstable_fk
                mapping = "mapping_#{idx}"
                mapping_joins << <<-SQL
                  JOIN #{unstable_fk[:table_class].key_backup_table} #{mapping}
                  ON #{mapping}.id = local.#{key[:name]}
                SQL
                remote_join_condition << "remote.#{key[:name]} = #{mapping}.new_id"
              else
                remote_join_condition << "remote.#{key[:name]} = local.#{key[:name]}"
              end
            end
            query =<<-SQL
              CREATE TEMPORARY TABLE #{key_backup_table} AS
              SELECT
                remote.id AS new_id, local.id
              FROM #{local_table} local
              #{mapping_joins&.join(' ')}
              JOIN #{remote_table} remote
              ON #{remote_join_condition.join(' AND ')}
            SQL
            connection.execute query
          end

          def restore
            update_keys_in_full_backup
            stmt =<<-SQL
              TRUNCATE #{table_name} CASCADE;
              INSERT INTO #{table_name}
              (#{column_names_cs})
              SELECT #{column_names_cs}
              FROM #{full_backup_table}
            SQL
            connection.execute stmt
          end

          def local_table
            ENV['TRASE_LOCAL_SCHEMA'] + '.' + table_name
          end

          def remote_table
            ENV['TRASE_REMOTE_SCHEMA'] + '.' + table_name
          end

          # comma separated column names
          # format for INSERT
          def column_names_cs(options = {})
            columns = self.columns.map(&:name).map(&:to_sym)
            columns -= options[:except] if options[:except]&.any?
            if options[:prefix]
              columns = columns.map { |c| "#{options[:prefix]}.#{c}" }
            end
            columns.join(', ')
          end

          protected

          def full_backup_table
            'bkp_' + table_name
          end

          def key_backup_table
            'bkp_key_' + table_name
          end

          private

          def update_keys_in_full_backup
            if stable_foreign_keys.any?
              delete_obsolete_rows_by_stable_ids
            end
            return unless unstable_foreign_keys.any?
            delete_obsolete_rows_by_unstable_ids
            update_unstable_ids
          end

          def delete_obsolete_rows(subquery_for_delete, where_conditions)
            stmt =<<-SQL
              DELETE FROM #{full_backup_table}
              USING (#{subquery_for_delete}) updated_identifiers
              WHERE #{full_backup_table}.id = updated_identifiers.id
              AND #{where_conditions.join(' AND ')}
            SQL
            connection.execute stmt
          end

          def delete_obsolete_rows_by_unstable_ids
            select_list = []
            joins = []
            delete_where_conditions = []
            unstable_foreign_keys.each.with_index do |fk, idx|
              table_alias = "t_#{idx}"
              select_list << "#{table_alias}.new_id AS new_#{fk[:name]}"
              joins << <<-SQL
                LEFT JOIN #{fk[:table_class].key_backup_table} #{table_alias}
                ON #{table_alias}.id = t.#{fk[:name]}
              SQL
              delete_where_conditions << "new_#{fk[:name]} IS NULL" # no nullable columns
            end

            subquery_for_delete =<<-SQL
              SELECT t.*, #{select_list.join(', ')}
              FROM #{full_backup_table} t
              #{joins.join(' ')}
            SQL
            delete_obsolete_rows(subquery_for_delete, delete_where_conditions)
          end

          def delete_obsolete_rows_by_stable_ids
            select_list = []
            joins = []
            delete_where_conditions = []
            stable_foreign_keys.each.with_index do |fk, idx|
              table_alias = "t_#{idx}"
              select_list << "#{table_alias}.id AS new_#{fk[:name]}"
              joins << <<-SQL
                LEFT JOIN #{fk[:table_class].table_name} #{table_alias}
                ON #{table_alias}.id = t.#{fk[:name]}
              SQL
              delete_where_conditions << "new_#{fk[:name]} IS NULL" # no nullable columns
            end

            subquery_for_delete =<<-SQL
              SELECT t.*, #{select_list.join(', ')}
              FROM #{full_backup_table} t
              #{joins.join(' ')}
            SQL
            delete_obsolete_rows(subquery_for_delete, delete_where_conditions)
          end

          def update_unstable_ids
            # update blue table ids
            select_list = []
            joins = []
            update_set_expressions = []
            unstable_foreign_keys.each.with_index do |fk, idx|
              table_alias = "t_#{idx}"
              select_list << "#{table_alias}.new_id AS new_#{fk[:name]}"
              joins << <<-SQL
                JOIN #{fk[:table_class].key_backup_table} #{table_alias}
                ON #{table_alias}.id = t.#{fk[:name]}
              SQL
              update_set_expressions << "#{fk[:name]} = updated_identifiers.new_#{fk[:name]}"
            end

            subquery_for_update =<<-SQL
              SELECT t.*, #{select_list.join(', ')}
              FROM #{full_backup_table} t
              #{joins.join(' ')}
            SQL

            stmt =<<-SQL
              UPDATE #{full_backup_table}
              SET #{update_set_expressions.join(', ')}
              FROM (#{subquery_for_update}) updated_identifiers
              WHERE #{full_backup_table}.id = updated_identifiers.id
            SQL
            connection.execute stmt
          end

          def unstable_foreign_keys; []; end
          def stable_foreign_keys; []; end
        end
      end
    end
  end
end
