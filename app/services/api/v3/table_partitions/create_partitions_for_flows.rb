# Creates partitions for flows and populates them with data from
# flows_v
module Api
  module V3
    module TablePartitions
      class CreatePartitionsForFlows < CreatePartitions
        def initialize
          @table_name = :partitioned_flows
          @partition_key = :context_id
          super(@table_name, @partition_key)
        end

        def partition_key_values
          Api::V3::Context.pluck(:id)
        end

        def indexes
          [
            {columns: [:context_id, :id], unique: true},
            {columns: :year}
          ]
        end

        def insert_data(partition_name, partition_key_value)
          execute(
            <<~SQL
              INSERT INTO #{partition_name}
              SELECT id, context_id, year, path, known_path_positions(path) FROM flows
              WHERE #{@partition_key} = #{partition_key_value};
            SQL
          )
        end
      end
    end
  end
end