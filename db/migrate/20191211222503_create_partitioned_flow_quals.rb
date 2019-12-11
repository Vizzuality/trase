class CreatePartitionedFlowQuals < ActiveRecord::Migration[5.2]
  def up
    execute <<~SQL
      CREATE TABLE partitioned_flow_quals (
        flow_id INT,
        qual_id INT,
        value TEXT
      ) PARTITION BY LIST (qual_id);
    SQL

    Api::V3::TablePartitions::CreatePartitionsForFlowQuals.new.call
  end

  def down
    drop_table :partitioned_flow_quals
  end
end
