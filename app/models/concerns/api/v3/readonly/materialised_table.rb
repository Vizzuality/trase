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
