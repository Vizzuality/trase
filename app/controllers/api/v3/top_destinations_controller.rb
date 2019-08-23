module Api
  module V3
    class TopDestinationsController < ApiController
      before_action :set_filter_params, only: :index

      skip_before_action :load_context

      def index
        @result = Api::V3::TopDestinations::ResponseBuilder.new(
          params[:commodity_id], params[:contexts_ids], @filter_params
        ).call

        render json: {data: @result}
      end

      private

      def set_filter_params
        year_start = params[:start_year]
        @filter_params = {
          node_type_id: params[:column_id],
          year_start: year_start,
          year_end: params[:end_year] || year_start,
          limit: params[:n_nodes]
        }
      end
    end
  end
end
