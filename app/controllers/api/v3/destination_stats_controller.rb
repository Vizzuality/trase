# This is used on the explore page, so that we can show flows into different destinations
# without requiring front end to pass the node type id
# We can currently have several destination node types, depending on context,
# and parametrisation by FE would be cumbersome.
module Api
  module V3
    class DestinationStatsController < ApiController
      include ParamHelpers

      before_action :set_filter_params, only: :index

      skip_before_action :load_context

      def index
        @result = Api::V3::DestinationStats::ResponseBuilder.new(
          params[:commodity_id],
          cs_string_to_int_array(params[:contexts_ids]),
          @filter_params
        ).call

        render json: {data: @result}
      end

      private

      def set_filter_params
        year_start = params[:start_year]
        @filter_params = {
          attribute_id: params[:attribute_id],
          year_start: year_start,
          year_end: params[:end_year] || year_start,
          limit: params[:n_nodes]
        }
      end
    end
  end
end
