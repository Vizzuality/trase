class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  rescue_from ActionController::ParameterMissing do |exception|
    render json: {:error => exception.message}, :status => 500
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
    expires_in 2.hours, :public => true
  end
end
