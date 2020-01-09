class AddNamesToPartitionedFlows < ActiveRecord::Migration[5.2]
  def up
    add_column :partitioned_flows, :names, 'TEXT[]'

    Api::V3::TablePartitions::CreatePartitionsForFlows.new.call
  end

  def down
    remove_column :partitioned_flows, :names
  end
end
