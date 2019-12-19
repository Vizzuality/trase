module Api
  module V3
    module TablePartitions
      class CreatePartitionsForDenormalisedFlowQuals < CreatePartitions
        def initialize
          @table_name = :partitioned_denormalised_flow_quals
          @partition_key = :context_id
          super(@table_name, @partition_key)
        end

        def partition_key_values
          Api::V3::Context.pluck(:id)
        end

        def indexes
          [
            {columns: [:context_id, :year]},
            {columns: :row_name}
          ]
        end

        def insert_data(partition_name, partition_key_value)
          execute(
            <<~SQL
              INSERT INTO #{partition_name}
              SELECT
                context_id, -- 4
                qual_id, -- 4
                year, -- 2
                STRING_AGG(DISTINCT value, ' / '),
                ARRAY_TO_STRING(path_names(path), '|') || year::TEXT,
                path,
                path_names(path),
                known_path_positions(path)
              FROM flow_quals
              JOIN flows ON flow_quals.flow_id = flows.id
              WHERE #{@partition_key} = #{partition_key_value}
              GROUP BY context_id, qual_id, year, path;
            SQL
          )
        end
      end
    end
  end
end
