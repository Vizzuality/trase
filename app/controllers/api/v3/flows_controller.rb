module Api
  module V3
    class FlowsController < ApiController
      before_action :set_filter_params, only: :index

      def index
        ensure_required_param_present(:include_columns)
        ensure_required_param_present(:cont_attribute_id)
        ensure_required_param_present(:start_year)
        @flows_result = Api::V3::Flows::Filter.new(
          @context, @filter_params
        ).call

        if @flows_result.errors.any?
          render json: {error: @flows_result.errors.join('; ')}, status: 400
        else
          render json: @flows_result,
                 adapter: :attributes,
                 serializer: Api::V3::Flows::ResultSerializer
        end
      end

      private

      def set_filter_params
        @filter_params = {
          node_types_ids: params[:include_columns],
          ncont_attribute_id: params[:ncont_attribute_id],
          cont_attribute_id: params[:cont_attribute_id],
          selected_nodes_ids: params[:selected_nodes],
          excluded_nodes_ids: params[:excluded_nodes],
          locked_nodes_ids: params[:locked_nodes],
          biome_id: params[:biome_filter_id],
          year_start: params[:start_year],
          year_end: params[:end_year] || params[:start_year],
          limit: params[:n_nodes]
        }
      end
    end
  end
end
