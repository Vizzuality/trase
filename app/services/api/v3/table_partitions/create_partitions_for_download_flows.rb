# Creates partitions for download_flows and populates them with data from
# download_flows_v
module Api
  module V3
    module TablePartitions
      class CreatePartitionsForDownloadFlows < CreatePartitions
        def initialize
          @table_name = :download_flows
          @partition_key = :year
          super(@table_name, @partition_key)
        end

        def partition_key_values
          Api::V3::Flow.select(:year).distinct.map(&:year)
        end

        def indexes
          [
            {columns: :year},
            {columns: :context_id},
            {columns: [:attribute_type, :attribute_id]},
            {columns: :path}
          ]
        end

        def insert_data(partition_name, partition_key_value)
          execute(
            <<~SQL
              INSERT INTO #{partition_name}
              SELECT * FROM download_flows_v
              WHERE #{@partition_key} = #{partition_key_value};
            SQL
          )
        end
      end
    end
  end
end
