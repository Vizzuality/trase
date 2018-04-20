module Api
  module V3
    module Nodes
      class NodesAttributesController < ApiController
        def index
          ensure_required_param_present(:start_year)
          ensure_required_param_present(:end_year)
          ensure_required_param_present(:layer_ids)

          result = Api::V3::NodeAttributes::Filter.new(
            @context, params[:start_year].to_i, params[:end_year].to_i, params[:layer_ids]
          ).result

          render json: {data: result}
        end
      end
    end
  end
end
