# Creates partitions for flow_quants and populates them with data from
# flow_quants_v
module Api
  module V3
    module TablePartitions
      class CreatePartitionsForFlowQuants < CreatePartitions
        def initialize
          @table_name = :partitioned_flow_quants
          @partition_key = :quant_id
          super(@table_name, @partition_key)
        end

        def partition_key_values
          Api::V3::Quant.pluck(:id)
        end

        def indexes
          [
            {columns: [:quant_id, :flow_id], unique: true}
          ]
        end

        def insert_data(partition_name, partition_key_value)
          execute(
            <<~SQL
              INSERT INTO #{partition_name}
              SELECT flow_id, quant_id, value FROM flow_quants
              WHERE #{@partition_key} = #{partition_key_value};
            SQL
          )
        end
      end
    end
  end
end