module Api
  module V3
    module Readonly
      class NodesStats < Api::V3::Readonly::BaseModel
        self.table_name = 'nodes_stats_mv'

        belongs_to :context
        belongs_to :quant
        belongs_to :node_type
        belongs_to :node
      end
    end
  end
end
