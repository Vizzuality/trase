# @deprecated This allows to serve a combined response for the actor profile
# and will be retired when we amend front-end to use the split responses
module Api
  module V3
    class PlaceNodesController < ApiController
      before_action :load_node
      before_action :set_year

      def show
        @result = Api::V3::PlaceNode::ResponseBuilder.new(
          @context, @node, @year
        ).call

        render json: {data: @result}
      end

      private

      def load_node
        ensure_required_param_present(:id)
        @node = Api::V3::Node.place_nodes.find(params[:id])
      end
    end
  end
end
