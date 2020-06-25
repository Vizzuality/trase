# @deprecated Use {Api::V3::Dashboards::FilterImporters} or
# {Api::V3::Dashboards::FilterExporters} instead.
# TODO: remove once dashboards_companies_mv retired
module Api
  module V3
    module Dashboards
      class FilterCompanies < FilterNodes
        private

        def param_name
          :companies_ids
        end

        def filtered_class
          Api::V3::Readonly::Dashboards::Company
        end

        def initialize_query
          super
          @query = @query.select(:country_id).group(:country_id)
        end
      end
    end
  end
end
