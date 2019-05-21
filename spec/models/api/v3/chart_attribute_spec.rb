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
    let(:non_duplicate_on_position) {
      FactoryBot.build(
        :api_v3_chart_attribute,
        chart: api_v3_place_basic_attributes,
        identifier: api_v3_place_basic_attributes_commodity_area.identifier + 'zonk',
        position: nil
      )
    }
    let(:duplicate_on_identifier) {
      FactoryBot.build(
        :api_v3_chart_attribute,
        chart: api_v3_place_basic_attributes,
        identifier: api_v3_place_basic_attributes_commodity_area.identifier,
        position: nil
      )
    }
    let(:non_duplicate_on_identifier) {
      FactoryBot.build(
        :api_v3_chart_attribute,
        chart: api_v3_place_trajectory_deforestation,
        identifier: '',
        position: api_v3_place_trajectory_deforestation_deforestation_v2.position + 1
      )
    }
    let(:duplicate_on_quant) do
      chart_attribute = FactoryBot.build(
        :api_v3_chart_attribute,
        chart: api_v3_place_trajectory_deforestation,
        identifier: nil,
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
        identifier: nil,
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
    it 'fails when chart + position duplicate' do
      expect(duplicate_on_position).to have(1).errors_on(:position)
    end
    it 'is successful when chart + empty position duplicate' do
      expect(non_duplicate_on_position).to have(0).errors_on(:position)
      expect { non_duplicate_on_position.save! }.not_to raise_error
    end
    it 'fails when chart + identifier duplicate' do
      expect(duplicate_on_identifier).to have(1).errors_on(:identifier)
    end
    it 'is successful when chart + empty identifier duplicate' do
      expect(non_duplicate_on_identifier).to have(0).errors_on(:identifier)
      expect { non_duplicate_on_identifier.save! }.not_to raise_error
    end
    it 'fails when same attribute associated more than once' do
      duplicate_on_quant.valid?
      expect(duplicate_on_quant).to have(1).errors_on(:base)
    end
    it 'is successful when same attribute associated as state average' do
      expect(state_average_variant).to have(0).errors_on(:base)
    end
    it 'saves empty identifier as NULL' do
      attribute = FactoryBot.create(:api_v3_chart_attribute, identifier: '')
      expect(attribute.identifier).to be_nil
    end
  end
  describe :destroy_zombies do
    let!(:referenced) { FactoryBot.create(:api_v3_chart_attribute) }
    let!(:chart_ind) {
      FactoryBot.create(
        :api_v3_chart_ind,
        chart_attribute: referenced,
        ind: FactoryBot.create(:api_v3_ind)
      )
    }
    let!(:zombie) { FactoryBot.create(:api_v3_chart_attribute) }
    let(:subject) { Api::V3::ChartAttribute }
    include_examples 'destroys zombies'
  end
end
