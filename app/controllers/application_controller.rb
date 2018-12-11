class ApplicationController < ActionController::Base
  protect_from_forgery

  include CacheUtils
  include Exceptions

  def data_update_supported?
    !Rails.env.production?
  end

  private

  def ensure_data_update_supported
    return true if data_update_supported?
    redirect_to admin_root_url and return false
  end
end
