require "rails_helper"

RSpec.describe Api::V3::QuantProperty, type: :model do
  include_context "api v3 quants"

  describe :validate do
    let(:property_without_quant) {
      FactoryBot.build(:api_v3_quant_property, quant: nil)
    }
    let(:duplicate) {
      FactoryBot.build(:api_v3_quant_property, quant: api_v3_area)
    }
    it "fails when quant missing" do
      expect(property_without_quant).to have(2).errors_on(:quant)
    end
    it "fails when quant taken" do
      expect(duplicate).to have(1).errors_on(:quant)
    end
  end
end
