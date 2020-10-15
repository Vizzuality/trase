require 'rails_helper'

RSpec.describe Api::V3::ContextualLayer, type: :model do
  include_context 'api v3 brazil contextual layers'

  describe :validate do
    let(:layer_without_context) {
      FactoryBot.build(:api_v3_contextual_layer, context: nil)
    }
    let(:duplicate) {
      FactoryBot.build(
        :api_v3_contextual_layer,
        context: api_v3_brazil_soy_context,
        identifier: 'landcover'
      )
    }
    it 'fails when context missing' do
      expect(layer_without_context).to have(2).errors_on(:context)
    end
    it 'fails when context + identifier taken' do
      expect(duplicate).to have(1).errors_on(:identifier)
    end
  end
end
