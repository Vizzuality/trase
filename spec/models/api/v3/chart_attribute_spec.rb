require 'rails_helper'

RSpec.describe Api::V3::ChartAttribute, type: :model do
  include_context 'api v3 brazil municipality place profile'

  describe :validate do
    let(:chart_attribute_without_chart) {
      FactoryBot.build(:api_v3_chart_attribute, chart: nil)
    }
    let(:duplicate) {
      FactoryBot.build(
        :api_v3_chart_attribute,
        chart: api_v3_place_trajectory_deforestation,
        position: api_v3_place_trajectory_deforestation_deforestation_v2.position
      )
    }
    it 'fails when chart missing' do
      expect(chart_attribute_without_chart).to have(1).error_on(:chart)
    end
    it 'fails when chart + position taken' do
      expect(duplicate).to have(1).errors_on(:position)
    end
  end
end
