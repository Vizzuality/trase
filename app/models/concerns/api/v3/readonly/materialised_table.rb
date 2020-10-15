require 'active_support/concern'

module Api
  module V3
    module Readonly
      module MaterialisedTable
        extend ActiveSupport::Concern

        def readonly?
          false
        end

        class_methods do
          def create_indexes
            self::INDEXES.each do |index_properties|
              columns = index_properties[:columns]
              execute "CREATE INDEX IF NOT EXISTS #{index_name(columns)} \
                ON #{table_name} (#{columns_to_string(columns, ',')})"
            end
          end

          def drop_indexes
            self::INDEXES.each do |index_properties|
              columns = index_properties[:columns]
              execute 'DROP INDEX IF EXISTS ' + index_name(columns)
            end
          end

          def refresh_by_conditions(old_conditions = nil, new_conditions = nil, _options = {})
            return unless (old_conditions || new_conditions)

            old_conditions = apply_key_translations(old_conditions || new_conditions)
            new_conditions = apply_key_translations(new_conditions || old_conditions)

            old_conditions_str = key_conditions_str(old_conditions)
            new_conditions_str = key_conditions_str(new_conditions)

            delete_sql = "DELETE FROM #{table_name} WHERE #{old_conditions_str}"
            insert_sql = <<~SQL
              INSERT INTO #{table_name}
              SELECT * FROM #{table_name}_v WHERE #{new_conditions_str}
            SQL

            transaction do
              connection.execute delete_sql
              connection.execute insert_sql
            end

            refresh_nested_dependents(old_conditions, new_conditions, _options)
          end

          def refresh_nested_dependents(old_conditions = nil, new_conditions = nil, options = {})
            dependent_classes = self.dependent_classes
            return if options[:skip_dependents]

            dependent_classes.each do |dependent_class|
              refreshed_tables = options[:refreshed_tables] || []
              next if refreshed_tables.include?(dependent_class.table_name)

              dependent_class.refresh_by_conditions(
                old_conditions, new_conditions, options.merge(refreshed_tables: refreshed_tables)
              )
            end
          end

          def apply_key_translations(conditions)
            translated_conditions = {}
            conditions.each do |key, value|
              translation_proc = self.key_translations[key.to_sym]
              if translation_proc
                translated_conditions = translated_conditions.merge(translation_proc.call(value))
              else
                translated_conditions[key] = value
              end
            end
            translated_conditions
          end

          def key_translations
            {}
          end

          protected

          def refresh_by_name(table_name, _options)
            drop_indexes
            connection.execute(
              "TRUNCATE #{table_name};
              INSERT INTO #{table_name} SELECT * FROM #{table_name}_v"
            )
            create_indexes
          end

          def index_name(columns)
            index_name = self.table_name + '_'
            index_name << columns_to_string(columns, '_')
            index_name << '_idx'
            index_name
          end

          def key_conditions_str(key_conditions)
            sanitize_sql_for_conditions([
              key_conditions.map { |k, v| "#{k} = :#{k}" }.join(' AND '),
              key_conditions
            ])
          end

          def columns_to_string(columns, separator)
            if columns.is_a? Array
              columns.join(separator)
            else
              columns.to_s
            end
          end

          def execute(sql)
            ActiveRecord::Base.connection.execute sql
          end
        end
      end
    end
  end
end
