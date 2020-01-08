class CreatePartitionedFlowValues < ActiveRecord::Migration[5.2]
  def up
    execute <<~SQL
      CREATE TABLE partitioned_denormalised_flow_inds (
        context_id INT, -- 4
        ind_id INT, -- 4
        value DOUBLE PRECISION, -- 8
        year SMALLINT, -- 2
        row_name TEXT,
        path INT[],
        names TEXT[],
        known_path_positions BOOLEAN[]
      ) PARTITION BY LIST (context_id);
    SQL

    Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowInds.new.call

    execute <<~SQL
      CREATE TABLE partitioned_denormalised_flow_quants (
        context_id INT,
        quant_id INT,
        value DOUBLE PRECISION,
        year SMALLINT,
        row_name TEXT,
        path INT[],
        names TEXT[],
        known_path_positions BOOLEAN[]
      ) PARTITION BY LIST (context_id);
    SQL

    Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowQuants.new.call

    execute <<~SQL
      CREATE TABLE partitioned_denormalised_flow_quals (
        context_id INT,
        qual_id INT,
        year SMALLINT,
        value TEXT,
        row_name TEXT,
        path INT[],
        names TEXT[],
        known_path_positions BOOLEAN[]
      ) PARTITION BY LIST (context_id);
    SQL

    Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowQuals.new.call
  end

  def down
    drop_table :partitioned_denormalised_flow_inds
    drop_table :partitioned_denormalised_flow_quants
    drop_table :partitioned_denormalised_flow_quals
  end
end
