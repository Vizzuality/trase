module Api
  module V3
    module Import
      class ReplaceBlueTable
        def initialize(table_class)
          @table_class = table_class
          @local_table = table_class.local_table
          @remote_table = table_class.remote_table
          @columns_cs = table_class.column_names_cs
          @remote_columns_cs = table_class.column_names_cs(prefix: @remote_table)
        end

        # Returns count of inserted rows
        def call
          Rails.logger.debug "Replacing #{@local_table}"
          replace
        end

        private

        def replace
          @table_class.connection.execute("TRUNCATE #{@local_table} CASCADE")
          stmt =<<~SQL
            INSERT INTO #{@local_table}
            (#{@columns_cs})
            SELECT #{@remote_columns_cs}
            FROM #{@remote_table}
          SQL
          result = @table_class.connection.execute(stmt)
          result.cmd_tuples
        end
      end
    end
  end
end
