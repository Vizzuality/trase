module FixtureRequestsHelpers
  def worldbank_uri(indicator, iso_code = 'ALL', year_range = nil)
    query_params = {format: :json, per_page: 10000}
    if year_range
      query_params[:date] = year_range
    end
    URI(
      "#{ENV['WORLD_BANK_API_URL']}/v2/country/#{iso_code}/indicator/" \
      "#{Api::V3::CountriesWbIndicators::ApiService::INDICATORS[indicator]}" \
      "?" + query_params.to_param
    )
  end

  def worldbank_request_path(indicator)
    "#{Rails.root}/spec/support/fixtures/requests/" \
      "world_bank_#{indicator}_indicators.json"
  end
end
