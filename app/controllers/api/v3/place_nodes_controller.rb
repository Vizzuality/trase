module Api
  module V3
    class PlaceNodesController < ApiController
      before_action :load_node
      before_action :set_year

      def show
        @result = Api::V3::PlaceNode::ResponseBuilder.new(@context, @node, @year).call

        if @result.errors.any?
          render json: @result.errors
        else
          render json: @result, root: 'data',
                 serializer: Api::V3::PlaceNode::ResultSerializer
        end
      end

      private

      def load_node
        ensure_required_param_present(:id)
        @node = Api::V3::Node.find(params[:id])
      end
    end
  end
end
