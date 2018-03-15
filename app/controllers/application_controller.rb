class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  rescue_from ActionController::ParameterMissing do |exception|
    render json: {error: exception.message}, status: 400
  end

  include CacheUtils

  def data_update_supported?
    !Rails.env.production?
  end

  private

  def load_context
    context_id = params[:context_id]

    if context_id.present?
      @context = Context.find(context_id)
    else
      raise ActionController::ParameterMissing, 'Required context_id missing'
    end
  end

  def set_caching_headers
    return true unless Rails.env.production?
    expires_in 2.hours, public: true
  end

  def ensure_data_update_supported
    return true if data_update_supported?
    redirect_to admin_root_url and return false
  end
end
