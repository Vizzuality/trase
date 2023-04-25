module Api
  module V3
    class NodesController < ApiController
      include Api::V3::ParamHelpers

      def index
        @nodes = Api::V3::Nodes::Filter.new(
          @context, filter_params
        ).call

        render json: @nodes,
               root: "data",
               each_serializer: Api::V3::Nodes::NodeSerializer
      end

      private

      def filter_params
        {
          node_types_ids: cs_string_to_int_array(params[:node_types_ids]),
          nodes_ids: cs_string_to_int_array(params[:nodes_ids])
        }
      end
    end
  end
end
