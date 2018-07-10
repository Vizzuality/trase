require 'rails_helper'

RSpec.describe Api::V3::NodeProperty, type: :model do
  include_context 'api v3 brazil soy nodes'

  describe :validate do
    let(:property_without_node) {
      FactoryBot.build(:api_v3_node_property, node: nil)
    }
    let(:duplicate) {
      FactoryBot.build(:api_v3_node_property, node: api_v3_state_node)
    }
    it 'fails when node missing' do
      expect(property_without_node).to have(2).errors_on(:node)
    end
    it 'fails when node taken' do
      expect(duplicate).to have(1).errors_on(:node)
    end
  end
end
