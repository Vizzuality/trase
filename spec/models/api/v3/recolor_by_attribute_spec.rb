require 'rails_helper'

RSpec.describe Api::V3::RecolorByAttribute, type: :model do
  before do
    Api::V3::RecolorByAttribute.skip_callback(:commit, :after, :refresh_dependencies)
  end
  after do
    Api::V3::RecolorByAttribute.set_callback(:commit, :after, :refresh_dependencies)
  end
  include_context 'api v3 brazil recolor by attributes'

  describe :validate do
    let(:attribute_without_context) {
      FactoryBot.build(:api_v3_recolor_by_attribute, context: nil)
    }
    let(:duplicate) {
      FactoryBot.build(
        :api_v3_recolor_by_attribute,
        context: api_v3_context,
        group_number: api_v3_forest_500_recolor_by_attribute.group_number,
        position: api_v3_forest_500_recolor_by_attribute.position
      )
    }
    it 'fails when context missing' do
      expect(attribute_without_context).to have(1).errors_on(:context)
    end
    it 'fails when context + group_number + position taken' do
      expect(duplicate).to have(1).errors_on(:position)
    end
  end
end
