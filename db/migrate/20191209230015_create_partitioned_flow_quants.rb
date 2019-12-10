class CreatePartitionedFlowQuants < ActiveRecord::Migration[5.2]
  def up
    execute <<~SQL
      CREATE TABLE partitioned_flow_quants (
        flow_id INT,
        quant_id INT,
        value DOUBLE PRECISION
      ) PARTITION BY LIST (quant_id);
    SQL

    Api::V3::TablePartitions::CreatePartitionsForFlowQuants.new.call
  end

  def down
    drop_table :partitioned_flow_quants
  end
end
