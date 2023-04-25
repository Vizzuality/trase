module FixtureRequestsHelpers
  def worldbank_uri(short_name, iso3 = "ALL", year_range = nil)
    list = Api::V3::CountriesWbIndicators::IndicatorsList::ATTRIBUTES
    indicator = list[short_name]

    Api::V3::CountriesWbIndicators::ApiService.request_uri(
      indicator[:wb_name], iso3, *year_range&.split(":")
    )
  end

  def com_trade_world_uri(commodity_codes, year)
    fixed_params = {
      type: "C", # Commodities (merchandise trade data)
      freq: "A", # Annual
      px: "HS", # HS Harmonized System (HS), as reported
      rg: "1,2", # trade regime (imports)
      r: "all", # reporter
      p: 0, # partner area World
      fmt: "json"
    }
    URI(Api::V3::CountriesComTradeIndicators::WorldRequestUriQueue::API_URL +
      "?" +
      fixed_params.merge(
        Api::V3::CountriesComTradeIndicators::WorldRequestUriQueue::YEAR_PARAMETER => year,
        Api::V3::CountriesComTradeIndicators::WorldRequestUriQueue::COMMODITY_CODES_PARAMETER => commodity_codes.join(",")
      ).to_query
    )
  end

  def com_trade_partner_uri(commodity_codes, year)
    fixed_params = {
      type: "C", # Commodities (merchandise trade data)
      freq: "A", # Annual
      px: "HS", # HS Harmonized System (HS), as reported
      rg: "1", # trade regime (imports)
      p: "all", # partner
      fmt: "json"
    }

    URI(Api::V3::CountriesComTradeIndicators::PartnerRequestUriQueue::API_URL +
      "?" +
      fixed_params.merge(
        Api::V3::CountriesComTradeIndicators::PartnerRequestUriQueue::YEAR_PARAMETER => year,
        Api::V3::CountriesComTradeIndicators::PartnerRequestUriQueue::COMMODITY_CODES_PARAMETER => commodity_codes.join(","),
        Api::V3::CountriesComTradeIndicators::PartnerRequestUriQueue::REPORTER_PARAMETER => "643,76"
      ).to_query
    )
  end

  def worldbank_request_path(indicator)
    "#{Rails.root}/spec/support/fixtures/requests/" \
      "world_bank_#{indicator}_indicators.json"
  end

  def com_trade_world_request_path(commodity_name, iso3, year)
    "#{Rails.root}/spec/support/fixtures/requests/" \
      "com_trade_world_#{[commodity_name, iso3, year].join("_")}.json"
  end

  def com_trade_partner_request_path(commodity_name, iso3, year)
    "#{Rails.root}/spec/support/fixtures/requests/" \
      "com_trade_partner_#{[commodity_name, iso3, year].join("_")}.json"
  end
end
