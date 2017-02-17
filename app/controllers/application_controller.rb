class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :load_context, only: [:index]

  private
  def load_context
    country_name = params[:country]
    commodity_name = params[:commodity]

    raise ActionController::ParameterMissing, 'Required country missing' if country_name.nil?
    raise ActionController::ParameterMissing, 'Required commodity missing' if commodity_name.nil?

    @country = Country.where('name ILIKE ?', country_name).first
    @commodity = Commodity.where('name ILIKE ?', commodity_name).first
  end
end
