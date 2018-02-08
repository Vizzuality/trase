module Api
  module V3
    class TopNodesController < ApiController
      before_action :set_year

      def index
        ensure_required_param_present(:column_id)
        @result = Api::V3::TopNodes::ResponseBuilder.new(
          @context, @year, params[:column_id], params[:n_nodes]
        ).call

        render json: {data: @result}
      end
    end
  end
end
