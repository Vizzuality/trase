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

        def initialize_query
          super
          @query = @query.select(:country_id).group(:country_id)
        end
      end
    end
  end
end
