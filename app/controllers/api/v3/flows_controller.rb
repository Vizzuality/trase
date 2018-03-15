module Api
  module V3
    class FlowsController < ApiController
      before_action :set_filter_params, only: :index

      def index
        ensure_required_param_present(:include_columns)
        ensure_required_param_present(:flow_quant)
        ensure_required_param_present(:year_start)
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
          recolor_ind_name: params[:flow_ind],
          recolor_qual_name: params[:flow_qual],
          resize_quant_name: params[:flow_quant],
          selected_nodes_ids: params[:selected_nodes],
          locked_nodes_ids: params[:locked_nodes],
          biome_id: params[:biome_filter_id],
          year_start: params[:year_start],
          year_end: params[:year_end] || params[:year_start],
          limit: params[:n_nodes]
        }
      end
    end
  end
end
