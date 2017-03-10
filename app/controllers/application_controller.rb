class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :load_context, except: [:get_contexts]
  before_action :set_caching_headers

  rescue_from ActionController::ParameterMissing do |exception|
    render json: { :error => exception.message }, :status => 500
  end

  private
  def load_context
    country_name = params[:country]
    country_id = params[:country_id]
    commodity_name = params[:commodity]
    commodity_id = params[:commodity_id]

    raise ActionController::ParameterMissing, 'Required country missing' if country_name.nil? and country_id.nil?
    raise ActionController::ParameterMissing, 'Required commodity missing' if commodity_name.nil? and commodity_id.nil?

    if (not country_id.nil? and not commodity_id.nil?)
      @context = Context
                     .where('commodity_id = ?', commodity_id.to_i)
                     .where('country_id = ?', country_id.to_i)
                     .first
    else
      @context = Context
                     .joins('NATURAL JOIN countries, commodities')
                     .where('countries.name ILIKE ?', country_name)
                     .where('commodities.name ILIKE ?', commodity_name)
                     .first
    end

    raise ActionController::ParameterMissing, 'The provided country/commodity combination could not be found' if @country.nil?

    @country = @context.country
    @commodity = @context.commodity
  end

  def set_caching_headers
    expires_in 2.hours, :public => true
  end
end
