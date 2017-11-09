module Api
  module V3
    class ApiController < ApplicationController
      before_action :load_context
      before_action :set_caching_headers

      private

      def load_context
        context_id = params[:context_id]

        if context_id.present?
          @context = Api::V3::Context.find(context_id)
        else
          raise ActionController::ParameterMissing,
                'Required context_id missing'
        end
      end
    end
  end
end
