class CreateDownloadFlowsTable < ActiveRecord::Migration[5.2]
  def up
    execute <<~SQL
      CREATE TABLE download_flows (
        id INT,
        context_id INT,
        year SMALLINT,
        path INT[],
        jsonb_path JSONB,
        attribute_type TEXT,
        attribute_id INT,
        attribute_name TEXT,
        text_values TEXT,
        sum NUMERIC,
        total TEXT,
        sort TEXT
      ) PARTITION BY LIST (year);
    SQL

    # Api::V3::TablePartitions.create_indexes
    Api::V3::TablePartitions::CreatePartitionsForDownloadFlows.new.create_indexes
  end

  def down
    drop_table :download_flows
  end
end
