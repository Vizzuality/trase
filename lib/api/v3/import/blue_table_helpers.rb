module Api
  module V3
    module Import
      module BlueTableHelpers
        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods
          def local_table
            ENV['TRASE_LOCAL_SCHEMA'] + '.' + table_name
          end

          def remote_table
            ENV['TRASE_LOCAL_FDW_SCHEMA'] + '.' + table_name
          end

          def key_backup
            return unless import_key.any?
            connection.execute "DROP TABLE IF EXISTS #{key_backup_table}"

            remote_join_condition = []
            joins = []

            import_key.each.with_index do |key, idx|
              blue_fk = blue_foreign_keys.find { |fk| fk[:name] == key[:name] }
              if blue_fk
                table_alias = "t_#{idx}"
                joins << <<~SQL
                  JOIN #{blue_fk[:table_class].key_backup_table} #{table_alias}
                  ON #{table_alias}.id = local.#{key[:name]}
                SQL
                remote_join_condition << "remote.#{key[:name]} = #{table_alias}.new_id"
              else
                remote_join_condition << "remote.#{key[:name]} = local.#{key[:name]}"
              end
            end
            query = <<~SQL
              CREATE TEMPORARY TABLE #{key_backup_table} AS
              SELECT remote.id AS new_id, local.id
              FROM #{local_table} local
              #{joins&.join(' ')}
              JOIN #{remote_table} remote
              ON #{remote_join_condition.join(' AND ')}
            SQL
            connection.execute query
          end

          def key_backup_table
            'bkp_key_' + table_name
          end
        end
      end
    end
  end
end
