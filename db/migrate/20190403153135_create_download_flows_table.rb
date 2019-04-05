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

    add_index :download_flows, :year, {name: :download_flows_year_idx}
    add_index :download_flows, :context_id, {name: :download_flows_context_id_idx}
    add_index :download_flows, [:attribute_type, :attribute_id], {name: :download_flows_attribute_type_attribute_id_idx}
    add_index :download_flows, :path, name: :download_flows_path_idx
  end

  def down
    execute 'DROP TABLE download_flows'
  end
end
