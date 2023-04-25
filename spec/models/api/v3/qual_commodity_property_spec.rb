require "rails_helper"

RSpec.describe Api::V3::QualCommodityProperty, type: :model do
  include_context "api v3 inds"

  describe :validate do
    let(:property_without_qual) do
      FactoryBot.build(:api_v3_qual_commodity_property, qual: nil)
    end

    let(:property_without_commodity) do
      FactoryBot.build(:api_v3_qual_commodity_property, commodity: nil)
    end

    let(:property_without_tooltip_text) do
      FactoryBot.build(:api_v3_qual_commodity_property, tooltip_text: nil)
    end

    it "fails when quant missing" do
      expect(property_without_qual).to have(2).errors_on(:qual)
    end

    it "fails when commodity missing" do
      expect(property_without_commodity).to have(2).errors_on(:commodity)
    end

    it "fails when tooltip_text missing" do
      expect(property_without_tooltip_text).to have(1).errors_on(:tooltip_text)
    end
  end
end
