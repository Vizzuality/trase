require 'rails_helper'
require 'models/api/v3/shared_attributes_examples'

RSpec.describe Api::V3::ChartAttribute, type: :model do
  include_context 'api v3 brazil municipality place profile'

  describe :validate do
    let(:chart_attribute_without_chart) {
      FactoryBot.build(:api_v3_chart_attribute, chart: nil)
    }
    let(:duplicate_on_position) {
      FactoryBot.build(
        :api_v3_chart_attribute,
        chart: api_v3_place_trajectory_deforestation,
        identifier: nil,
        position: api_v3_place_trajectory_deforestation_deforestation_v2.position
      )
    }
    let(:duplicate_on_quant) do
      chart_attribute = FactoryBot.build(
        :api_v3_chart_attribute,
        chart: api_v3_place_trajectory_deforestation,
        position: api_v3_place_trajectory_deforestation_deforestation_v2.position + 1,
        state_average: false
      )
      FactoryBot.build(
        :api_v3_chart_quant,
        chart_attribute: chart_attribute,
        quant: api_v3_deforestation_v2
      )
      chart_attribute
    end
    let(:state_average_variant) do
      chart_attribute = FactoryBot.create(
        :api_v3_chart_attribute,
        chart: api_v3_place_trajectory_deforestation,
        position: api_v3_place_trajectory_deforestation_deforestation_v2.position + 1,
        state_average: true
      )
      FactoryBot.create(
        :api_v3_chart_quant,
        chart_attribute: chart_attribute,
        quant: api_v3_deforestation_v2
      )
      chart_attribute
    end
    it 'fails when chart missing' do
      expect(chart_attribute_without_chart).to have(1).error_on(:chart)
    end
    it 'fails when chart + position taken' do
      expect(duplicate_on_position).to have(1).errors_on(:position)
    end
    it 'fails when same attribute associated more than once' do
      duplicate_on_quant.valid?
      expect(duplicate_on_quant).to have(1).errors_on(:base)
    end
    it 'is successful when same attribute associated as state average' do
      expect(state_average_variant).to have(0).errors_on(:base)
    end
  end
  describe :destroy_widows do
    let!(:referenced) { FactoryBot.create(:api_v3_chart_attribute) }
    let!(:chart_ind) {
      FactoryBot.create(
        :api_v3_chart_ind,
        chart_attribute: referenced,
        ind: FactoryBot.create(:api_v3_ind)
      )
    }
    let!(:widow) { FactoryBot.create(:api_v3_chart_attribute) }
    let(:subject) { Api::V3::ChartAttribute }
    include_examples 'destroys widows'
  end
end
