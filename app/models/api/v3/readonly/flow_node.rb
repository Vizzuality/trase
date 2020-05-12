# == Schema Information
#
# Table name: flow_nodes
#
#  flow_id(id from flows)            :integer          not null
#  node_id(id from path at position) :integer          not null
#  context_id(from flows)            :integer          not null
#  position(0-indexed)               :integer          not null
#  year(from flows)                  :integer          not null
#
# Indexes
#
#  flow_nodes_context_id_position_idx  (context_id,position)
#  flow_nodes_flow_id_idx              (flow_id)
#  flow_nodes_node_id_idx              (node_id)
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
