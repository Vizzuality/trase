require 'rails_helper'

RSpec.describe Api::V3::ContextNodeTypeProperty, type: :model do
  include_context 'api v3 brazil context node types'

  describe :validate do
    let(:property_without_context_node_type) {
      FactoryBot.build(
        :api_v3_context_node_type_property, context_node_type: nil
      )
    }
    let(:duplicate) {
      FactoryBot.build(
        :api_v3_context_node_type_property,
        context_node_type: api_v3_biome_context_node
      )
    }
    let(:property_without_prefix) {
      FactoryBot.build(
        :api_v3_context_node_type_property, prefix: nil
      )
    }
    it 'fails when context node type missing' do
      expect(property_without_context_node_type).to have(2).
        errors_on(:context_node_type)
    end
    it 'fails when context node type taken' do
      expect(duplicate).to have(1).errors_on(:context_node_type)
    end
    it 'fails when prefix missing' do
      expect(property_without_prefix).to have(1).
        errors_on(:prefix)
    end
  end
end
