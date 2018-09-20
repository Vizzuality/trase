module Api
  module V3
    module Readonly
      module Dashboards
        module Refresh
          extend ActiveSupport::Concern

          class_methods do
            def refresh(options = {})
              unless options[:skip_flow_paths]
                FlowPath.refresh(options.slice(:concurrently))
              end
              super(options.slice(:concurrently))
            end
          end
        end
      end
    end
  end
end
