module Api
  module V3
    class NodesAttributesController < ApiController
      def index
        # TODO: use ensure_required_param_present when merged
        unless params[:start_year].present?
          raise ActionController::ParameterMissing,
                'Required param start_year missing'
        end
        # TODO: use ensure_required_param_present when merged
        unless params[:end_year].present?
          raise ActionController::ParameterMissing,
                'Required param end_year missing'
        end

        result = Api::V3::NodeAttributes::Filter.new(
          @context, params[:start_year].to_i, params[:end_year].to_i
        ).result

        render json: {data: result}
      end

      private

      def set_filter_params
        @filter_params = {
          year_start: params[:year_start],
          year_end: params[:year_end] || params[:year_start],
          limit: params[:n_nodes]
        }
      end
    end
  end
end
