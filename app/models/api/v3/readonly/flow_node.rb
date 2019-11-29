# == Schema Information
#
# Table name: flow_nodes_mv
#
#  context_id :integer
#  flow_id    :integer
#  year       :integer
#  position   :bigint(8)
#  node_id    :integer
#
# Indexes
#
#  flow_nodes_mv_flow_id_node_id_idx  (flow_id,node_id) UNIQUE
#

# This class is not backed by a materialized view, but a table.
# The table is refreshed using a SQL function.
# It should only be refreshed once per data import.
module Api
  module V3
    module Readonly
      class FlowNode < Api::Readonly::BaseModel
        include Api::V3::Readonly::MaterialisedTable

        self.table_name = 'flow_nodes'

        INDEXES = [
          {columns: :flow_id},
          {columns: :node_id},
          {columns: [:context_id, :position]}
        ].freeze
      end
    end
  end
end
