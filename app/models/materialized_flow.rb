# == Schema Information
#
# Table name: materialized_flows
#
#  context_id          :integer
#  column_group        :integer
#  column_position     :integer
#  node                :text
#  node_id             :integer
#  geo_id              :text
#  exporter_node_id    :integer
#  exporter_node       :text
#  importer_node_id    :integer
#  importer_node       :text
#  country_node_id     :integer
#  country_node        :text
#  year                :integer
#  indicator_type      :text
#  indicator_id        :integer
#  indicator_with_unit :text
#  total               :text
#

class MaterializedFlow < ApplicationRecord
  def self.refresh
    Scenic.database.refresh_materialized_view(:flow_indicators, concurrently: false)
    Scenic.database.refresh_materialized_view(:node_flows, concurrently: false)
    Scenic.database.refresh_materialized_view(table_name, concurrently: false)
  end
end
