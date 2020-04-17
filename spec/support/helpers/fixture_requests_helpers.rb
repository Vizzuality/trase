module FixtureRequestsHelpers
  def worldbank_uri(indicator, iso_code = 'ALL')
    year_range =
      "#{Api::V3::Flow.minimum(:year)}:#{Api::V3::Flow.maximum(:year)}"
    URI(
      "#{ENV['WORLD_BANK_API_URL']}/v2/country/#{iso_code}/indicator/" \
      "#{Api::V3::CountriesWbIndicators::ApiService::INDICATORS[indicator]}" \
      "?date=#{year_range}&format=json&per_page=10000"
    )
  end

  def worldbank_request_path(indicator)
    "#{Rails.root}/spec/support/fixtures/requests/" \
      "world_bank_#{indicator}_indicators.json"
  end
end
