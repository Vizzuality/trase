# Creates partitions for flow_quals and populates them with data from
# flow_quals_v
module Api
  module V3
    module TablePartitions
      class CreatePartitionsForFlowQuals < CreatePartitions
        def initialize
          @table_name = :partitioned_flow_quals
          @partition_key = :qual_id
          super(@table_name, @partition_key)
        end

        def partition_key_values
          Api::V3::Qual.pluck(:id)
        end

        def indexes
          [
            {columns: [:qual_id, :flow_id], unique: true}
          ]
        end

        def insert_data(partition_name, partition_key_value)
          execute(
            <<~SQL
              INSERT INTO #{partition_name}
              SELECT flow_id, qual_id, value FROM flow_quals
              WHERE #{@partition_key} = #{partition_key_value};
            SQL
          )
        end
      end
    end
  end
end
