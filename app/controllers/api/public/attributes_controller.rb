module Api
  module Public
    class AttributesController < ApiController
      skip_before_action :load_context
      before_action :set_filter_params, only: :index

      def index
        @result = Api::Public::Attributes::ResponseBuilder.new(
          @filter_params
        ).call

        render json: {data: @result}
      end

      private

      def set_filter_params
        @filter_params = {
          country: params[:country],
          commodity: params[:commodity]
        }
      end
    end
  end
end
