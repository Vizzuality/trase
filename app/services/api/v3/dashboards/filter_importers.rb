module Api
  module V3
    module Dashboards
      class FilterImporters < FilterNodes
        private

        def param_name
          :importers_ids
        end

        def filtered_class
          Api::V3::Readonly::Dashboards::Importer
        end

        def initialize_query
          super
          @query = @query.select(:country_id).group(:country_id)
        end
      end
    end
  end
end
