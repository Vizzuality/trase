module Api
  module V3
    class TopNodesController < ApiController
      before_action :set_filter_params, only: :index

      def index
        ensure_required_param_present(:column_id)
        @result = Api::V3::TopNodes::ResponseBuilder.new(
          @context, @filter_params
        ).call

        render json: {data: @result}
      end

      private

      def set_filter_params
        year_start = params[:year_start] || @context.default_year
        @filter_params = {
          node_type_id: params[:column_id],
          year_start: year_start,
          year_end: params[:year_end] || year_start,
          limit: params[:n_nodes]
        }
      end
    end
  end
end
