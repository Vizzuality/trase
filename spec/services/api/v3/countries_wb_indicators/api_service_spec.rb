require 'rails_helper'

RSpec.describe Api::V3::CountriesWbIndicators::ApiService do
  include FixtureRequestsHelpers

  context '#indicator_request' do
    before do
      uri = worldbank_uri(:population, 'AR')
      response = File.read(worldbank_request_path(:population))
      stub_request(:get, uri).to_return(body: response)
      allow(Api::V3::Flow).to receive(:minimum).and_return(2013)
      allow(Api::V3::Flow).to receive(:maximum).and_return(2013)
    end

    it 'return world bank population indicators' do
      list = Api::V3::CountriesWbIndicators::IndicatorsList::ATTRIBUTES
      indicator_name = list[:population][:wb_name]
      indicators =
        Api::V3::CountriesWbIndicators::ApiService.indicator_request(indicator_name, 'AR')

      expect(indicators[:indicators].size).to eql 4
      indicator = indicators[:indicators].first
      expect(indicator[:iso_code]).to eql 'ARG'
      expect(indicator[:name]).to eql indicator_name
      expect(indicator[:year]).to eql 2013
      expect(indicator[:value]).to eql 379_705_719
    end
  end
end
