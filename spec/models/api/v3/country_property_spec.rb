require "rails_helper"

RSpec.describe Api::V3::CountryProperty, type: :model do
  include_context "api v3 brazil country"
  include_context "api v3 paraguay country"

  describe :validate do
    let(:property_without_country) {
      FactoryBot.build(:api_v3_country_property, country: nil)
    }
    let(:duplicate) {
      FactoryBot.build(:api_v3_country_property, country: api_v3_brazil)
    }
    it "fails when country missing" do
      expect(property_without_country).to have(2).errors_on(:country)
    end
    it "fails when country taken" do
      expect(duplicate).to have(1).errors_on(:country)
    end
  end
end
