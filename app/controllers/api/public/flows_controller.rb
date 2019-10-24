module Api
  module Public
    class FlowsController < ApiController
      include PaginationHeaders
      include PaginatedCollection

      skip_before_action :load_context

      def index
        ensure_required_param_present(:country)
        ensure_required_param_present(:commodity)

        initialize_collection_for_index
        render json: @collection,
               root: 'data',
               each_serializer: Api::Public::Flows::FlowSerializer
      end

      private

      def filter_params
        {
          country: params[:country],
          commodity: params[:commodity],
          attribute_id: params[:attribute_id],
          start_year: params[:start_year],
          end_year: params[:end_year]
        }
      end

      def default_per_page
        100
      end

      def filter_klass
        Api::Public::Flows::ResponseBuilder
      end
    end
  end
end
