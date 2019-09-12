# This materialised view does not depend on any yellow tables.
# It should only be refreshed once per data import.
module Api
  module V3
    module Readonly
      class FlowNode < Api::V3::Readonly::BaseModel
        self.table_name = 'flow_nodes_mv'
      end
    end
  end
end
