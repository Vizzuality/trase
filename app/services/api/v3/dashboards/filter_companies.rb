# @deprecated Use {Api::V3::Dashboards::FilterImporters} or
# {Api::V3::Dashboards::FilterExporters} instead.
# TODO: remove once dashboards_companies_mv retired
module Api
  module V3
    module Dashboards
      class FilterCompanies < FilterNodes
        include Query

        def initialize(params)
          @self_ids = params.delete(:param_name)
          @nodes_to_filter_by = Api::V3::Dashboards::NodesToFilterBy.new(params)
          super(params)
        end

        private

        def param_name
          :companies_ids
        end

        def filtered_class
          Api::V3::Readonly::Dashboards::Company
        end
      end
    end
  end
end
