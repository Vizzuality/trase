module Api
  module V3
    module Import
      class ReplaceBlueTable
        def initialize(table_class, source_schema)
          @table_class = table_class
          @local_table = table_class.local_table
          @source_table = table_class.source_table(source_schema)
          @columns_cs = table_class.column_names_cs
          @source_columns_cs = table_class.column_names_cs(prefix: @source_table)
        end

        # Returns count of inserted rows
        def call
          Rails.logger.debug "Replacing #{@local_table}"
          replace
        end

        private

        def replace
          @table_class.connection.execute("DELETE FROM #{@local_table}")
          stmt = <<~SQL
            INSERT INTO #{@local_table}
            (#{@columns_cs})
            SELECT #{@source_columns_cs}
            FROM #{@source_table}
          SQL
          result = @table_class.connection.execute(stmt)
          cnt = result.cmd_tuples
          cnt
        end
      end
    end
  end
end
