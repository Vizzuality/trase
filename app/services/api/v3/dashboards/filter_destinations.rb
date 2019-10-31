module Api
  module V3
    module Dashboards
      class FilterDestinations < FilterNodes
        private

        def param_name
          :destinations_ids
        end

        def filtered_class
          Api::V3::Readonly::Dashboards::Destination
        end
      end
    end
  end
end
