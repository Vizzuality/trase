require "rails_helper"
require "models/api/v3/shared_attributes_examples"

RSpec.describe Api::V3::MapAttribute, type: :model do
  include_context "api v3 brazil map attributes"

  describe :validate do
    let(:layer_without_map_attribute_group) {
      FactoryBot.build(:api_v3_map_attribute, map_attribute_group: nil)
    }
    let(:duplicate) {
      FactoryBot.build(
        :api_v3_map_attribute,
        map_attribute_group: api_v3_map_attribute_group1,
        position: api_v3_water_scarcity_map_attribute.position
      )
    }
    it "fails when map_attribute_group missing" do
      expect(layer_without_map_attribute_group).to have(2).errors_on(:map_attribute_group)
    end
    it "fails when map_attribute_group + position taken" do
      expect(duplicate).to have(1).errors_on(:position)
    end
  end

  describe :destroy_zombies do
    let!(:referenced) { FactoryBot.create(:api_v3_map_attribute) }
    let!(:map_quant) {
      FactoryBot.create(
        :api_v3_map_quant,
        map_attribute: referenced,
        quant: FactoryBot.create(:api_v3_quant)
      )
    }
    let!(:zombie) { FactoryBot.create(:api_v3_map_attribute) }
    let(:subject) { Api::V3::MapAttribute }
    include_examples "destroys zombies"
  end
end
