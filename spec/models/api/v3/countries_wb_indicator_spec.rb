require 'rails_helper'

RSpec.describe Api::V3::CountriesWbIndicator, type: :model do
  describe :validate do
    let(:countries_wb_indicator_without_iso_code) do
      FactoryBot.build(:api_v3_countries_wb_indicator, iso_code: nil)
    end
    let(:countries_wb_indicator_without_year) do
      FactoryBot.build(:api_v3_countries_wb_indicator, year: nil)
    end
    let(:countries_wb_indicator_with_same_iso_code_and_year) do
      countries_wb_indicator = FactoryBot.create(:api_v3_countries_wb_indicator)
      FactoryBot.build(
        :api_v3_countries_wb_indicator,
        iso_code: countries_wb_indicator.iso_code,
        year: countries_wb_indicator.year,
        name: countries_wb_indicator.name
      )
    end
    let(:countries_wb_indicator_without_name) do
      FactoryBot.build(:api_v3_countries_wb_indicator, name: nil)
    end
    let(:countries_wb_indicator_without_value) do
      FactoryBot.build(:api_v3_countries_wb_indicator, value: nil)
    end
    let(:countries_wb_indicator_without_rank) do
      FactoryBot.build(:api_v3_countries_wb_indicator, rank: nil)
    end

    it 'fails when iso_code missing' do
      expect(countries_wb_indicator_without_iso_code).to have(1).errors_on(:iso_code)
    end

    it 'fails when year missing' do
      expect(countries_wb_indicator_without_year).to have(1).errors_on(:year)
    end

    it 'fails when name missing' do
      expect(countries_wb_indicator_without_name).to have(1).errors_on(:name)
    end

    it 'fails when value missing' do
      expect(countries_wb_indicator_without_value).to have(1).errors_on(:value)
    end

    it 'fails when rank missing' do
      expect(countries_wb_indicator_without_rank).to have(1).errors_on(:rank)
    end

    it 'fails when there is an existing countries_wb_indicator with the same iso and year' do
      expect(countries_wb_indicator_with_same_iso_code_and_year).to have(1).errors_on(:name)
    end
  end
end
