module Api
  module Public
    class AttributesController < BaseController
      skip_before_action :load_context

      def index
        @result = Api::Public::Attributes::ResponseBuilder.new(
          filter_params
        ).call

        render json: {data: @result}
      end

      private

      def filter_params
        {
          country: params[:country],
          commodity: params[:commodity]
        }
      end
    end
  end
end
