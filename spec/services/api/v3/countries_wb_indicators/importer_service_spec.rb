require 'rails_helper'

RSpec.describe Api::V3::CountriesWbIndicators::ImporterService do
  include FixtureRequestsHelpers
  include_context 'api v3 brazil country'

  context '#call' do
    before :each do
      FactoryBot.create(:api_v3_country, iso2: 'AR')
      FactoryBot.create(:api_v3_country, iso2: 'BO')
      FactoryBot.create(:api_v3_country, iso2: 'CO')
      allow(Api::V3::Flow).to receive(:minimum).and_return(2013)
      allow(Api::V3::Flow).to receive(:maximum).and_return(2013)
    end

    context 'when there is unexpected countries' do
      before do
        uri = worldbank_uri(:population, 'ALL', '2013:2013')
        response =
          File.read(worldbank_request_path(:population_for_other_countries))
        stub_request(:get, uri).to_return(body: response)
      end

      it 'do not create the countries_wb_indicator for it' do
        expect do
          Api::V3::CountriesWbIndicators::ImporterService.call([:population])
        end.to change(Api::V3::CountriesWbIndicator, :count).by(0)
      end
    end

    context 'when there is existing countries_wb_indicators' do
      before do
        FactoryBot.create(
          :api_v3_countries_wb_indicator,
          iso_code: 'ARG',
          year: 2013,
          name: 'population',
          value: 0.0
        )

        uri = worldbank_uri(:population, 'ALL', '2013:2013')
        response = File.read(worldbank_request_path(:population))
        stub_request(:get, uri).to_return(body: response)
      end

      it 'replace the value of the existing indicators' do
        expect do
          Api::V3::CountriesWbIndicators::ImporterService.call([:population])
        end.to change(Api::V3::CountriesWbIndicator, :count).by(3)

        countries_wb_indicator = Api::V3::CountriesWbIndicator.find_by(
          iso_code: 'ARG', year: 2013, name: 'population'
        )
        expect(countries_wb_indicator.value).to eql 379_705_719.0
        expect(countries_wb_indicator.rank).to eql 2
      end
    end

    context 'when there is no existing countries_wb_indicators' do
      before do
        uri = worldbank_uri(:population, 'ALL', '2013:2013')
        response = File.read(worldbank_request_path(:population))
        stub_request(:get, uri).to_return(body: response)
      end

      it 'create the new indicators' do
        expect do
          Api::V3::CountriesWbIndicators::ImporterService.call([:population])
        end.to change(Api::V3::CountriesWbIndicator, :count).by(4)
      end
    end
  end
end
