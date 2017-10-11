# == Schema Information
#
# Table name: materialized_flows
#
#  flow_id             :integer
#  context_id          :integer
#  year                :integer
#  name_0              :text
#  name_1              :text
#  name_2              :text
#  name_3              :text
#  name_4              :text
#  name_5              :text
#  name_6              :text
#  name_7              :text
#  node_id_0           :integer
#  node_id_1           :integer
#  node_id_2           :integer
#  node_id_3           :integer
#  node_id_4           :integer
#  node_id_5           :integer
#  node_id_6           :integer
#  node_id_7           :integer
#  exporter_node_id    :integer
#  importer_node_id    :integer
#  country_node_id     :integer
#  indicator_type      :text
#  indicator_id        :integer
#  indicator           :text
#  indicator_with_unit :text
#  name_in_download    :text
#  bool_and            :boolean
#  sum                 :float
#  total               :text
#

class MaterializedFlow < ApplicationRecord
  def self.refresh
    Scenic.database.refresh_materialized_view(:flow_indicators, concurrently: false)
    Scenic.database.refresh_materialized_view(:node_flows, concurrently: false)
    Scenic.database.refresh_materialized_view(table_name, concurrently: false)
  end
end
