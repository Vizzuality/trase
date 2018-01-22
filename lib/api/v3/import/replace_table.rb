module Api
  module V3
    module Import
      class ReplaceTable
        attr_reader :errors

        def initialize(table_class)
          @key_ary = table_class.import_key.map { |key| key[:name] }
          @local_table = table_class.local_table
          @remote_table = table_class.remote_table
          @errors = []
          @columns = table_class.columns.map(&:name).map(&:to_sym)
          @columns_cs = table_class.column_names_cs
          @remote_columns_cs = table_class.column_names_cs(prefix: @remote_table)
        end

        def call
          Rails.logger.debug "Replacing #{@local_table}"

          unless (@key_ary - @columns).empty?
            add_error(
              'Columns declared to make the key missing from table: ' +
              @key_ary.inspect
            )
            Rails.logger.warn @errors.inspect
            return
          end

          ActiveRecord::Base.connection.execute("TRUNCATE #{@local_table} CASCADE")

          rows_to_insert, rows_to_insert_cnt = prepare_rows_to_insert
          Rails.logger.debug "#{rows_to_insert_cnt} rows to insert, \
total should be #{count_table(@remote_table)}"

          inserted_rows_cnt = insert_rows(rows_to_insert)
          Rails.logger.debug "#{inserted_rows_cnt} rows inserted, \
total is #{count_table(@local_table)}"
        end

        def prepare_rows_to_insert
          rows = "SELECT #{@remote_columns_cs} FROM #{@remote_table}"
          rows_cnt = count_subquery(rows)
          [rows, rows_cnt]
        end

        def insert_rows(rows)
          query = "INSERT INTO #{@local_table} (#{@columns_cs}) #{rows}"
          result = ActiveRecord::Base.connection.execute(query)
          result.cmd_tuples
        end

        def add_error(message)
          @errors << message
        end

        def count_subquery(subquery)
          result = ActiveRecord::Base.connection.execute(
            "SELECT COUNT(*) FROM (#{subquery}) s"
          )
          result.getvalue(0, 0)
        end

        def count_table(table)
          result = ActiveRecord::Base.connection.execute(
            "SELECT COUNT(*) FROM #{table}"
          )
          result.getvalue(0, 0)
        end
      end
    end
  end
end
