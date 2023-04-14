module Api
  module V3
    class ContextsController < ApiController
      skip_before_action :load_context

      def index
        @contexts = Api::V3::Contexts::Filter.new.call

        render json: @contexts, root: "data",
               each_serializer: Api::V3::Contexts::ContextSerializer
      end
    end
  end
end
