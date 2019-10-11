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

# This materialised view does not depend on any yellow tables.
# It should only be refreshed once per data import.
module Api
  module V3
    module Readonly
      class FlowNode < Api::Readonly::BaseModel
        self.table_name = 'flow_nodes_mv'
      end
    end
  end
end
