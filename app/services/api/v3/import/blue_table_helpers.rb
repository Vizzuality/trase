module Api
  module V3
    module Import
      module BlueTableHelpers
        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods
          def local_table
            ENV["TRASE_LOCAL_SCHEMA"] + "." + table_name
          end

          def source_table(source_schema)
            source_schema + "." + table_name
          end

          def key_backup(source_schema)
            return unless import_key.any?

            connection.execute "DROP TABLE IF EXISTS #{key_backup_table}"

            source_join_condition = []
            joins = []

            import_key.each.with_index do |key, idx|
              blue_fk = blue_foreign_keys.find { |fk| fk[:name] == key[:name] }
              if blue_fk
                table_alias = "t_#{idx}"
                joins << <<~SQL
                  JOIN #{blue_fk[:table_class].key_backup_table} #{table_alias}
                  ON #{table_alias}.id = local.#{key[:name]}
                SQL
                source_join_condition << "source.#{key[:name]} = #{table_alias}.new_id"
              else
                source_join_condition << "source.#{key[:name]} = local.#{key[:name]}"
              end
            end
            query = <<~SQL
              CREATE TEMPORARY TABLE #{key_backup_table} AS
              SELECT source.id AS new_id, local.id
              FROM #{local_table} local
              #{joins&.join(" ")}
              JOIN #{source_table(source_schema)} source
              ON #{source_join_condition.join(" AND ")}
            SQL
            connection.execute query
          end

          def key_backup_table
            "bkp_key_" + table_name
          end

          def ids_map
            query = "SELECT id, new_id FROM #{key_backup_table}"
            result = connection.execute query
            Hash[result.map { |r| [r["id"], r["new_id"]] }]
          end
        end
      end
    end
  end
end
