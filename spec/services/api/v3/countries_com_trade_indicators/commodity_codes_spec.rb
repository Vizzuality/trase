require "rails_helper"

RSpec.describe Api::V3::CountriesComTradeIndicators::CommodityCodes do
  include_context "api v3 commodities"

  let(:commodity_codes) {
    stub_const(
      "Api::V3::CountriesComTradeIndicators::CommodityCodes::DATA_FILE_PATH",
      "spec/support/fixtures/commodity_codes.csv"
    )
    Api::V3::CountriesComTradeIndicators::CommodityCodes.new
  }

  let(:beef1) {
    {
      com_trade_codes: ["020110", "020120", "020210", "020220"],
      trase_name: api_v3_beef.name,
      trase_id: api_v3_beef.id,
      eq_factor: 1.0
    }
  }
  let(:beef2) {
    {
      com_trade_codes: ["020130", "020230"],
      trase_name: api_v3_beef.name,
      trase_id: api_v3_beef.id,
      eq_factor: 1.372560001
    }
  }

  describe :lookup_by_trase_id do
    it "returns correct commodities for trase id" do
      expect(
        commodity_codes.lookup_by_trase_id(api_v3_beef.id)
      ).to match_array([beef1, beef2])
    end
  end

  describe :lookup_by_com_trade_code do
    it "returns correct commodity for com trade code" do
      expect(
        commodity_codes.lookup_by_com_trade_code("020110")
      ).to eq(beef1)
    end
  end
end
