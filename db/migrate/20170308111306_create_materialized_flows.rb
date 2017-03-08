class CreateMaterializedFlows < ActiveRecord::Migration
  def change
    create_view :materialized_flows, materialized: true
    add_index :materialized_flows, :node_id
    add_index :materialized_flows, :exporter_node_id
    add_index :materialized_flows, :importer_node_id
    add_index :materialized_flows, :country_node_id
    add_index :materialized_flows, :quant_id
  end
end
