require 'rails_helper'
require 'models/api/v3/shared_attributes_examples'

RSpec.describe Api::V3::ResizeByAttribute, type: :model do
  include_context 'api v3 brazil resize by attributes'

  describe :validate do
    let(:attribute_without_context) {
      FactoryBot.build(:api_v3_resize_by_attribute, context: nil)
    }
    let(:duplicate) {
      FactoryBot.build(
        :api_v3_resize_by_attribute,
        context: api_v3_context,
        group_number: api_v3_volume_resize_by_attribute.group_number,
        position: api_v3_volume_resize_by_attribute.position
      )
    }
    it 'fails when context missing' do
      expect(attribute_without_context).to have(2).errors_on(:context)
    end
  end

  describe :destroy_zombies do
    let!(:referenced) { FactoryBot.create(:api_v3_resize_by_attribute) }
    let!(:resize_by_quant) {
      FactoryBot.create(
        :api_v3_resize_by_quant,
        resize_by_attribute: referenced,
        quant: FactoryBot.create(:api_v3_quant)
      )
    }
    let!(:zombie) { FactoryBot.create(:api_v3_resize_by_attribute) }
    let(:subject) { Api::V3::ResizeByAttribute }
    include_examples 'destroys zombies'
  end
end
