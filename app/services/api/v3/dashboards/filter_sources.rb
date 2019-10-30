module Api
  module V3
    module Dashboards
      class FilterSources < FilterNodes
        private

        def param_name
          :sources_ids
        end

        def filtered_class
          Api::V3::Readonly::Dashboards::Source
        end
      end
    end
  end
end
