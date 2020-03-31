require 'rails_helper'

RSpec.describe Api::V3::CountriesWbIndicators::ApiService do
  include FixtureRequestsHelpers

  context '#population_indicators' do
    before do
      uri = worldbank_uri(:population, 'AR')
      response = JSON.parse(File.read(worldbank_request_path(:population)))
      stub_request(:get, uri).to_return(body: response)
    end

    it 'return world bank population indicators' do
      indicators =
        Api::V3::CountriesWbIndicators::ApiService.population_indicators('AR')

      expect(indicators.size).to eql 4
      expect(indicators.first[:iso_code]).to eql 'ARG'
      expect(indicators.first[:name]).to eql 'population'
      expect(indicators.first[:year]).to eql 2013
      expect(indicators.first[:value]).to eql 379_705_719
    end
  end

  context '#gdp_indicators' do
    before do
      uri = worldbank_uri(:gdp, 'AR')
      response = JSON.parse(File.read(worldbank_request_path(:gdp)))
      stub_request(:get, uri).to_return(body: response)
    end

    it 'return world bank gdp indicators' do
      indicators =
        Api::V3::CountriesWbIndicators::ApiService.gdp_indicators('AR')

      expect(indicators.size).to eql 4
      expect(indicators.first[:iso_code]).to eql 'ARG'
      expect(indicators.first[:name]).to eql 'gdp'
      expect(indicators.first[:year]).to eql 2013
      expect(indicators.first[:value]).to eql 2_867_811_095_547.36
    end
  end

  context '#land_area_indicators' do
    before do
      uri = worldbank_uri(:land_area, 'AR')
      response = JSON.parse(File.read(worldbank_request_path(:land_area)))
      stub_request(:get, uri).to_return(body: response)
    end

    it 'return world bank land_area indicators' do
      indicators =
        Api::V3::CountriesWbIndicators::ApiService.land_area_indicators('AR')

      expect(indicators.size).to eql 4
      expect(indicators.first[:iso_code]).to eql 'ARG'
      expect(indicators.first[:name]).to eql 'land_area'
      expect(indicators.first[:year]).to eql 2013
      expect(indicators.first[:value]).to eql 11_232_639.0078735
    end
  end

  context '#agricultural_land_area_indicators' do
    before do
      uri = worldbank_uri(:agricultural_land_area, 'AR')
      response =
        JSON.parse(File.read(worldbank_request_path(:agricultural_land_area)))
      stub_request(:get, uri).to_return(body: response)
    end

    it 'return world bank agricultural_land_area indicators' do
      indicators =
        Api::V3::CountriesWbIndicators::ApiService.agricultural_land_area_indicators('AR')

      expect(indicators.size).to eql 4
      expect(indicators.first[:iso_code]).to eql 'ARG'
      expect(indicators.first[:name]).to eql 'agricultural_land_area'
      expect(indicators.first[:year]).to eql 2013
      expect(indicators.first[:value]).to eql 4_785_734.43078995
    end
  end

  context '#forested_land_area_indicators' do
    before do
      uri = worldbank_uri(:forested_land_area, 'AR')
      response =
        JSON.parse(File.read(worldbank_request_path(:forested_land_area)))
      stub_request(:get, uri).to_return(body: response)
    end

    it 'return world bank forested_land_area indicators' do
      indicators =
        Api::V3::CountriesWbIndicators::ApiService.forested_land_area_indicators('AR')

      expect(indicators.size).to eql 4
      expect(indicators.first[:iso_code]).to eql 'ARG'
      expect(indicators.first[:name]).to eql 'forested_land_area'
      expect(indicators.first[:year]).to eql 2013
      expect(indicators.first[:value]).to eql 386_635.796659589
    end
  end
end
