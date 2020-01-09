module Api
  module V3
    module Dashboards
      class FilterExporters < FilterNodes
        private

        def param_name
          :exporters_ids
        end

        def filtered_class
          Api::V3::Readonly::Dashboards::Exporter
        end
      end
    end
  end
end
