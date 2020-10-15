require 'rails_helper'

RSpec.describe Api::V3::ContextProperty, type: :model do
  include_context 'api v3 brazil soy context'

  describe :validate do
    let(:property_without_context) {
      FactoryBot.build(:api_v3_context_property, context: nil)
    }
    let(:duplicate) {
      FactoryBot.build(:api_v3_context_property, context: api_v3_brazil_soy_context)
    }
    it 'fails when context missing' do
      expect(property_without_context).to have(2).errors_on(:context)
    end
    it 'fails when context taken' do
      expect(duplicate).to have(1).errors_on(:context)
    end
  end
end
