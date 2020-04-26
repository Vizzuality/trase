module FixtureRequestsHelpers
  def worldbank_uri(short_name, iso3 = 'ALL', year_range = nil)
    list = Api::V3::CountriesWbIndicators::IndicatorsList::ATTRIBUTES
    indicator = list[short_name]

    Api::V3::CountriesWbIndicators::ApiService.request_uri(
      indicator[:wb_name], iso3, *year_range&.split(':')
    )
  end

  def com_trade_uri(commodity_codes, year)
    Api::V3::CountriesComTradeIndicators::ImporterService.request_uri(
      commodity_codes, year
    )
  end

  def worldbank_request_path(indicator)
    "#{Rails.root}/spec/support/fixtures/requests/" \
      "world_bank_#{indicator}_indicators.json"
  end

  def com_trade_request_path(commodity_name, iso3, year)
    "#{Rails.root}/spec/support/fixtures/requests/" \
      "com_trade_#{[commodity_name, iso3, year].join('_')}.json"
  end
end
