module FixtureRequestsHelpers
  def worldbank_uri(indicator, iso_code = 'ALL')
    URI(
      "#{ENV['WORLD_BANK_API_URL']}/v2/country/#{iso_code}/indicator/" \
      "#{Api::V3::CountriesWbIndicators::ApiService::INDICATORS[indicator]}" \
      '?format=json&per_page=10000'
    )
  end

  def worldbank_request_path(indicator)
    "#{Rails.root}/spec/support/fixtures/requests/" \
      "world_bank_#{indicator}_indicators.json"
  end
end
