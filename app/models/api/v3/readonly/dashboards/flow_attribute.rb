module Api
  module V3
    module Readonly
      module Dashboards
        class FlowAttribute < Api::V3::Readonly::BaseModel
          self.table_name = 'dashboards_flow_attributes_mv'

          def self.long_running?
            true
          end
        end
      end
    end
  end
end
