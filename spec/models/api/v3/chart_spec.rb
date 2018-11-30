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
        identifier: :trajectory_deforestation,
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
end
