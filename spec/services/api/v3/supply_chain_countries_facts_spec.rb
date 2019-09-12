require 'rails_helper'

RSpec.describe Api::V3::SupplyChainCountriesFacts do
  include_context 'api v3 brazil flows quants'
  include_context 'api v3 paraguay flows quants'

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::FlowQuantTotal.refresh(sync: true, skip_dependents: true)
  end

  let(:volume_attribute) {
    api_v3_volume.readonly_attribute
  }

  describe :facts do
    let(:subject) {
      Api::V3::SupplyChainCountriesFacts.new(api_v3_soy.id)
    }

    it 'returns correct soy Volume total for Brazil (default year)' do
      brazil_facts = subject.facts.find do |fact|
        fact.country_id == api_v3_brazil.id
      end
      brazil_volume = brazil_facts.facts.find do |fact|
        fact.attribute_id == volume_attribute.id
      end
      expect(brazil_volume.total).to eq(100)
    end

    it 'returns correct soy Volume total for Paraguay (default year)' do
      paraguay_facts = subject.facts.find do |fact|
        fact.country_id == api_v3_paraguay.id
      end
      paraguay_volume = paraguay_facts.facts.find do |fact|
        fact.country_id == api_v3_paraguay.id &&
          fact.attribute_id == volume_attribute.id
      end
      expect(paraguay_volume.total).to eq(10)
    end
  end

  describe :attributes do
    let(:subject) {
      Api::V3::SupplyChainCountriesFacts.new(api_v3_soy.id)
    }

    it 'returns Volume' do
      attributes = subject.attributes
      expect(attributes).to include(volume_attribute)
    end
  end
end
