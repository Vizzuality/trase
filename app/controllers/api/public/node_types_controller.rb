module Api
  module Public
    class NodeTypesController < ApiController
      skip_before_action :load_context

      def index
        @result = Api::Public::NodeTypes::Filter.new(
          filter_params
        ).call

        render json: @result,
               root: 'data',
               each_serializer: Api::Public::NodeTypes::PathNodeTypesSerializer
      end

      private

      def filter_params
        {
          country: params[:country],
          commodity: params[:commodity]
        }
      end

      def filter_klass
        Api::Public::NodeTypes::Filter
      end
    end
  end
end