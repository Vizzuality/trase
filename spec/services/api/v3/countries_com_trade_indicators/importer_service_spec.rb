require 'rails_helper'

RSpec.describe Api::V3::CountriesComTradeIndicators::ImporterService do
  include FixtureRequestsHelpers
  include_context 'api v3 brazil beef context'
  include_context 'api v3 brazil beef nodes'
  include_context 'api v3 brazil beef flows'

  let(:commodity_codes) {
    instance_double(Api::V3::CountriesComTradeIndicators::CommodityCodes)
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

  before :each do
    commodities = [beef1, beef2]
    allow(Api::V3::CountriesComTradeIndicators::CommodityCodes).to receive(:new).and_return(commodity_codes)
    allow(commodity_codes).to receive(:lookup_by_trase_id).and_return(
      commodities
    )
    beef1[:com_trade_codes].each do |code|
      allow(commodity_codes).to receive(:lookup_by_com_trade_code).with(code).and_return(beef1)
    end
    beef2[:com_trade_codes].each do |code|
      allow(commodity_codes).to receive(:lookup_by_com_trade_code).with(code).and_return(beef2)
    end
    codes = commodities.map do |commodity|
      commodity[:com_trade_codes]
    end.flatten

    uri = com_trade_uri(codes, 2015)
    response = File.read(com_trade_request_path('BEEF', 'BRA', 2015))
    stub_request(:get, uri).to_return(body: response)
  end

  describe '#call' do
    it 'saves rows in primary table' do
      importer = Api::V3::CountriesComTradeIndicators::ImporterService.new
      Sidekiq::Testing.inline! do
        expect do
          importer.call
        end.to change(Api::V3::CountriesComTradeIndicator, :count).by(8)
      end
    end
  end
end
