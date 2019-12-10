class CreatePartitionedFlows < ActiveRecord::Migration[5.2]
  def up
    execute <<~SQL
      CREATE TABLE partitioned_flows (
        id INT,
        context_id INT,
        year SMALLINT,
        path INT[],
        unknown_path_positions SMALLINT[]
      ) PARTITION BY LIST (context_id);
    SQL

    Api::V3::TablePartitions::CreatePartitionsForFlows.new.call
  end

  def down
    drop_table :partitioned_flows
  end
end
