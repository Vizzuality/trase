module Api
  module V3
    module Dashboards
      class FilterExporters < FilterNodes
        include Query

        def initialize(params)
          @self_ids = params.delete(:param_name)
          @nodes_to_filter_by = Api::V3::Dashboards::NodesToFilterBy.new(params)
          super(params)
        end

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
