require "rails_helper"

RSpec.describe Api::V3::QualProperty, type: :model do
  include_context "api v3 quals"

  describe :validate do
    let(:property_without_qual) {
      FactoryBot.build(:api_v3_qual_property, qual: nil)
    }
    let(:duplicate) {
      FactoryBot.build(:api_v3_qual_property, qual: api_v3_state)
    }
    it "fails when qual missing" do
      expect(property_without_qual).to have(2).errors_on(:qual)
    end
    it "fails when qual taken" do
      expect(duplicate).to have(1).errors_on(:qual)
    end
  end
end
