# == Schema Information
#
# Table name: materialized_flows
#
#  flow_id          :integer
#  context_id       :integer
#  year             :integer
#  node_id          :integer
#  node_type        :text
#  node             :text
#  geo_id           :text
#  exporter_node_id :integer
#  exporter_node    :text
#  importer_node_id :integer
#  importer_node    :text
#  country_node_id  :integer
#  country_node     :text
#  quant_id         :integer
#  name             :text
#  value            :float
#

class MaterializedFlow < ApplicationRecord
  def self.refresh
    Scenic.database.refresh_materialized_view(:flow_indicators, concurrently: false)
    Scenic.database.refresh_materialized_view(:node_flows, concurrently: false)
    Scenic.database.refresh_materialized_view(table_name, concurrently: false)
  end
end
