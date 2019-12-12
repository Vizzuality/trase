# Creates partitions for flow_inds and populates them with data from
# flow_inds_v
module Api
  module V3
    module TablePartitions
      class CreatePartitionsForFlowInds < CreatePartitions
        def initialize
          @table_name = :partitioned_flow_inds
          @partition_key = :ind_id
          super(@table_name, @partition_key)
        end

        def partition_key_values
          Api::V3::Ind.pluck(:id)
        end

        def indexes
          [
            {columns: [:ind_id, :flow_id], unique: true}
          ]
        end

        def insert_data(partition_name, partition_key_value)
          execute(
            <<~SQL
              INSERT INTO #{partition_name}
              SELECT flow_id, ind_id, value FROM flow_inds
              WHERE #{@partition_key} = #{partition_key_value};
            SQL
          )
        end
      end
    end
  end
end
