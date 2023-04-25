require "rails_helper"

RSpec.describe Api::V3::IndProperty, type: :model do
  include_context "api v3 inds"

  describe :validate do
    let(:property_without_ind) {
      FactoryBot.build(:api_v3_ind_property, ind: nil)
    }
    let(:duplicate) {
      FactoryBot.build(:api_v3_ind_property, ind: api_v3_forest_500)
    }
    it "fails when ind missing" do
      expect(property_without_ind).to have(2).errors_on(:ind)
    end
    it "fails when ind taken" do
      expect(duplicate).to have(1).errors_on(:ind)
    end
  end
end
