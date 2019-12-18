class CreatePartitionedFlowInds < ActiveRecord::Migration[5.2]
  def up
    execute <<~SQL
      CREATE TABLE partitioned_flow_inds (
        flow_id INT,
        ind_id INT,
        value DOUBLE PRECISION
      ) PARTITION BY LIST (ind_id);
    SQL

    Api::V3::TablePartitions::CreatePartitionsForFlowInds.new.call
  end

  def down
    drop_table :partitioned_flow_inds
  end
end
