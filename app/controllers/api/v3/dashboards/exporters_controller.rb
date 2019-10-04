module Api
  module V3
    module Dashboards
      class ExportersController < ApiController
        include FilterParams
        include PaginationHeaders
        include PaginatedCollection
        skip_before_action :load_context

        def index
          initialize_collection_for_index

          render json: @collection,
                 root: 'data',
                 each_serializer: Api::V3::Dashboards::CompanySerializer
        end

        def search
          ensure_required_param_present(:q)
          initialize_collection_for_search

          render json: @collection,
                 root: 'data',
                 each_serializer: Api::V3::Dashboards::NodeSerializer
        end

        private

        def filter_klass
          FilterExporters
        end
      end
    end
  end
end
