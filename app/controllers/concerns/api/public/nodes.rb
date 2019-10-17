module Api
  module Public
    module Nodes
      extend ActiveSupport::Concern

      include PaginationHeaders
      include PaginatedCollection

      included do
        skip_before_action :load_context
      end

      def index
        initialize_collection_for_index
        render json: @collection,
               root: 'data',
               each_serializer: Api::Public::Nodes::NodeSerializer
      end

      private

      def filter_params
        {
          country: params[:country],
          commodity: params[:commodity],
          node_type: params[:node_type],
          geo_id: params[:geo_id],
          name: params[:name]
        }
      end

      def default_per_page
        100
      end
    end
  end
end
