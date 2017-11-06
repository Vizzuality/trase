module Api
  module V2
    class IndicatorsController < ApiController
      def index
        @indicators = ContextIndicator.where(context_id: @context.id).
          preload(:indicator).
          map(&:indicator)
        render json: @indicators, each_serializer: IndicatorSerializer, root: 'indicators'
      end
    end
  end
end
