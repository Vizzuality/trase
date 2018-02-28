require 'rails_helper'

RSpec.describe Api::V3::MapAttributeGroup, type: :model do
  before do
    Api::V3::MapAttributeGroup.skip_callback(:commit, :after, :refresh_dependencies)
  end
  after do
    Api::V3::MapAttributeGroup.set_callback(:commit, :after, :refresh_dependencies)
  end
  include_context 'api v3 brazil map attribute groups'

  describe :validate do
    let(:group_without_context) {
      FactoryBot.build(:api_v3_map_attribute_group, context: nil)
    }
    let(:duplicate) {
      FactoryBot.build(
        :api_v3_map_attribute_group,
        context: api_v3_context,
        position: 1
      )
    }
    it 'fails when context missing' do
      expect(group_without_context).to have(1).errors_on(:context)
    end
    it 'fails when context + position taken' do
      expect(duplicate).to have(1).errors_on(:position)
    end
  end
end
