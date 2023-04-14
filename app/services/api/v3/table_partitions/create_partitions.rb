module Api
  module V3
    module TablePartitions
      class CreatePartitions
        def initialize(table_name, partition_key)
          @table_name = table_name
          @partition_key = partition_key
        end

        # @param options
        # @option options [Boolean] :skip_dependents skip refreshing
        def call(options = {})
          ensure_partitioned_table_exists
          Api::V3::BaseModel.transaction do
            drop_partitions
            drop_indexes

            partition_key_values.each do |value|
              create_partition(value)
            end

            create_indexes
          end
        end

        def drop_indexes
          indexes.each do |index_properties|
            columns = index_properties[:columns]
            execute "DROP INDEX IF EXISTS " + index_name(columns)
          end
        end

        def create_indexes
          indexes.each do |index_properties|
            columns = index_properties[:columns]
            unique = index_properties[:unique] ? "UNIQUE" : ""
            execute <<~SQL
              CREATE #{unique} INDEX IF NOT EXISTS #{index_name(columns)}
              ON #{@table_name} (#{columns_to_string(columns, ",")})
            SQL
          end
        end

        private

        # @abstract
        # @return [Array] Values of partition key
        # @raise [NotImplementedError] when not defined in subclass
        def partition_key_values
          raise NotImplementedError
        end

        # @abstract
        # @return [Array<Hash>] List of index properties
        # @raise [NotImplementedError] when not defined in subclass
        def indexes
          raise NotImplementedError
        end

        # @abstract
        # @raise [NotImplementedError] when not defined in subclass
        def insert_data
          raise NotImplementedError
        end

        def ensure_partitioned_table_exists
          unless ActiveRecord::Base.connection.table_exists? @table_name
            raise("#{@table_name} doesn't exist")
          end
        end

        def drop_partitions
          sql = <<~SQL
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name ~ '#{@table_name}_\\d+'
          SQL
          result = execute(sql)
          result.each do |row|
            execute "DROP TABLE #{row["table_name"]}"
          end
        end

        def create_partition(partition_key_value)
          partition_name = "#{@table_name}_#{partition_key_value}"
          create_partition_table(@table_name, partition_name)
          insert_data(partition_name, partition_key_value)
          attach_partition(@table_name, partition_name, partition_key_value)
        end

        def create_partition_table(table_name, partition_name)
          execute(
            <<~SQL
              CREATE TABLE #{partition_name}
                (LIKE #{table_name} INCLUDING DEFAULTS INCLUDING CONSTRAINTS);
            SQL
          )
        end

        def attach_partition(table_name, partition_name, list)
          execute(
            <<~SQL
              ALTER TABLE #{table_name} ATTACH PARTITION #{partition_name}
                FOR VALUES IN (#{list});
            SQL
          )
        end

        def columns_to_string(columns, separator)
          if columns.is_a? Array
            columns.join(separator)
          else
            columns.to_s
          end
        end

        def index_name(columns)
          index_name = "#{@table_name}_"
          index_name << columns_to_string(columns, "_")
          index_name << "_idx"
          index_name
        end

        def execute(sql)
          ActiveRecord::Base.connection.execute sql
        end
      end
    end
  end
end
