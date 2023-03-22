module Api
  module V3
    class NodeTypesController < ApiController
      def index
        @node_types = Api::V3::NodeTypes::Filter.new(@context).call

        render json: @node_types,
               root: "data",
               each_serializer: Api::V3::NodeTypes::NodeTypeSerializer
      end
    end
  end
end
