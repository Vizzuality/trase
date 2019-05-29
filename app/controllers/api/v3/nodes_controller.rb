module Api
  module V3
    class NodesController < ApiController
      def index
        @nodes = Api::V3::Nodes::Filter.new(
          @context
        ).call

        render json: @nodes,
               root: 'data',
               each_serializer: Api::V3::Nodes::NodeSerializer
      end
    end
  end
end
