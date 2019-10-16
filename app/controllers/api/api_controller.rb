module Api
  class ApiController < ActionController::API
    include ActionController::MimeResponds
    include CacheUtils
    include Exceptions

    before_action :load_context
    before_action :set_caching_headers

    private

    def load_context
      ensure_required_param_present(:context_id)
      @context = Api::V3::Context.find(params[:context_id])
    end

    def ensure_required_param_present(param_symbol)
      return if params[param_symbol].present?
      raise ActionController::ParameterMissing,
            "Required param #{param_symbol} missing"
    end

    def ensure_required_param_set(param_symbol, default)
      params[param_symbol] = default unless params[param_symbol].present?
    end
  end
end
