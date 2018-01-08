module Api
  module V3
    module Nodes
      class NodesAttributesController < ApiController
        def index
          ensure_required_param_present(:start_year)
          ensure_required_param_present(:end_year)

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
end
