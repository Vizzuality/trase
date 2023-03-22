# == Schema Information
#
# Table name: node_stats_mv
#
#  context_id   :integer
#  quant_id     :integer
#  node_type_id :integer
#  node_id      :integer
#  year         :integer
#  geo_id       :text
#  name         :text
#  value        :float
#  height       :float
#
# Indexes
#
#  node_stats_mv_context_year_quant_node_node_type_idx  (context_id,year,quant_id,node_id,node_type_id) UNIQUE
#
module Api
  module V3
    module Readonly
      class NodeStats < Api::Readonly::BaseModel
        include Api::V3::Readonly::MaterialisedView

        self.table_name = "node_stats_mv"

        belongs_to :context
        belongs_to :quant
        belongs_to :node_type
        belongs_to :node
      end
    end
  end
end
