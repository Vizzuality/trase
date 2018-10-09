module Api
  module V3
    module Readonly
      module Dashboards
        class NodeAttribute < Api::V3::Readonly::BaseModel
          self.table_name = 'dashboards_node_attributes_mv'

          def self.long_running?
            true
          end
        end
      end
    end
  end
end
