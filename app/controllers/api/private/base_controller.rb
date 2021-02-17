module Api
  module Private
    class BaseController < ActionController::API
      include DeviseTokenAuth::Concerns::SetUserByToken
      include ActionController::MimeResponds
      include CacheUtils
      include Exceptions

      before_action :set_caching_headers
      before_action :authenticate_user!
    end
  end
end
