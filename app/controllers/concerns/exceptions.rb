module Exceptions
  extend ActiveSupport::Concern

  included do
    rescue_from ActionController::ParameterMissing do |exception|
      render json: {error: exception.message}, status: 400
    end
  end
end
