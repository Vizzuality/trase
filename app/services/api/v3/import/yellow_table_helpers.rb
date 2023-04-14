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

          def full_backup_table
            "bkp_" + table_name
          end

          def yellow_foreign_keys
            []
          end
        end
      end
    end
  end
end
