module Api
  module V3
    class ApiController < ApplicationController
      before_action :load_context
      before_action :set_caching_headers

      private

      def load_context
        ensure_required_param_present(:context_id)
        @context = Api::V3::Context.find(params[:context_id])
      end

      def set_year
        @year = params[:year]&.to_i || @context&.default_year
        return if @year.present?
        raise ActionController::ParameterMissing,
              'Required param year missing'
      end

      def ensure_required_param_present(param_symbol)
        return if params[param_symbol].present?
        raise ActionController::ParameterMissing,
              "Required param #{param_symbol} missing"
      end
    end
  end
end
