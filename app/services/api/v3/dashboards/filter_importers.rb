module Api
  module V3
    module Dashboards
      class FilterImporters < FilterNodes
        include Query

        def initialize(params)
          @self_ids = params.delete(:param_name)
          @nodes_to_filter_by = Api::V3::Dashboards::NodesToFilterBy.new(params)
          super(params)
        end

        private

        def param_name
          :importers_ids
        end

        def filtered_class
          Api::V3::Readonly::Dashboards::Importer
        end
      end
    end
  end
end
