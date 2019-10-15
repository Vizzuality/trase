# == Schema Information
#
# Table name: nodes_stats_mv
#
#  context_id   :integer
#  year         :integer
#  quant_id     :integer
#  node_type_id :integer
#  node_id      :integer
#  name         :text
#  geo_id       :text
#  value        :float
#  height       :float
#
# Indexes
#
#  nodes_stats_mv_context_year_quant_node_node_type_idx  (context_id,year,quant_id,node_id,node_type_id) UNIQUE
#

module Api
  module V3
    module Readonly
      class NodesStats < Api::Readonly::BaseModel
        self.table_name = 'nodes_stats_mv'

        belongs_to :context
        belongs_to :quant
        belongs_to :node_type
        belongs_to :node
      end
    end
  end
end
