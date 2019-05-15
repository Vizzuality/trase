require 'rails_helper'

RSpec.describe Api::V3::Chart, type: :model do
  include_context 'api v3 brazil municipality place profile'

  describe :validate do
    let(:chart_without_profile) {
      FactoryBot.build(:api_v3_chart, profile: nil)
    }
    let(:chart_with_parent_from_different_profile) {
      FactoryBot.build(
        :api_v3_chart,
        parent: api_v3_place_trajectory_deforestation
      )
    }
    let(:chart_with_parent_is_not_root) {
      FactoryBot.build(
        :api_v3_chart,
        profile: api_v3_brazil_municipality_place_profile,
        parent: api_v3_place_environmental_indicators
      )
    }
    let(:duplicate) {
      FactoryBot.build(
        :api_v3_chart,
        profile: api_v3_brazil_municipality_place_profile,
        identifier: :place_trajectory_deforestation,
        position: 1
      )
    }
    it 'fails when profile missing' do
      expect(chart_without_profile).to have(1).error_on(:profile)
    end
    it 'fails when profile + identifier taken' do
      expect(duplicate).to have(1).errors_on(:identifier)
    end
    it 'fails when parent from another profile' do
      expect(
        chart_with_parent_from_different_profile
      ).to have(1).error_on(:parent)
    end
    it 'fails when parent is not root' do
      expect(chart_with_parent_is_not_root).to have(1).error_on(:parent)
    end
  end

  describe :chart_type do
    include_context 'api v3 brazil municipality place profile'
    include_context 'api v3 brazil exporter actor profile'
    it 'is line_chart_with_map for actor_top_countries' do
      expect(api_v3_exporter_top_countries.chart_type).to eq(:line_chart_with_map)
    end

    it 'is tabs_table for place_indicators_table' do
      expect(api_v3_place_indicators_table.chart_type).to eq(:tabs_table)
    end

    it 'is scatterplot for actor_exporting_companies' do
      expect(api_v3_exporter_exporting_companies.chart_type).to eq(:scatterplot)
    end

    it 'is stacked_line_chart for place_trajectory_deforestation' do
      expect(api_v3_place_trajectory_deforestation.chart_type).to eq(:stacked_line_chart)
    end

    it 'is sankey for place_top_consumer_actors' do
      expect(api_v3_place_top_consumer_actors.chart_type).to eq(:sankey)
    end

    it 'is null for actor_basic_attributes' do
      expect(api_v3_exporter_basic_attributes.chart_type).to be_nil
    end
  end
end
