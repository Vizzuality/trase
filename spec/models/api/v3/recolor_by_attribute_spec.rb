require 'rails_helper'
require 'models/api/v3/shared_attributes_examples'

RSpec.describe Api::V3::RecolorByAttribute, type: :model do
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
      expect(attribute_without_context).to have(2).errors_on(:context)
    end
  end

  describe :destroy_zombies do
    let!(:referenced) { FactoryBot.create(:api_v3_recolor_by_attribute) }
    let!(:recolor_by_ind) {
      FactoryBot.create(
        :api_v3_recolor_by_ind,
        recolor_by_attribute: referenced,
        ind: FactoryBot.create(:api_v3_ind)
      )
    }
    let!(:zombie) { FactoryBot.create(:api_v3_recolor_by_attribute) }
    let(:subject) { Api::V3::RecolorByAttribute }
    include_examples 'destroys zombies'
  end
end
