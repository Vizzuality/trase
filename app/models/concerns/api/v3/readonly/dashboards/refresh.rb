module Api
  module V3
    module Readonly
      module Dashboards
        module Refresh
          extend ActiveSupport::Concern

          class_methods do
            def refresh_dependencies(options = {})
              FlowPath.refresh(concurrently: false) # no unique index
            end
          end
        end
      end
    end
  end
end
