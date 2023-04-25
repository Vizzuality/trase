require "rails_helper"

RSpec.describe Api::V3::QuantContextProperty, type: :model do
  include_context "api v3 inds"

  describe :validate do
    let(:property_without_quant) do
      FactoryBot.build(:api_v3_quant_context_property, quant: nil)
    end

    let(:property_without_context) do
      FactoryBot.build(:api_v3_quant_context_property, context: nil)
    end

    let(:property_without_tooltip_text) do
      FactoryBot.build(:api_v3_quant_context_property, tooltip_text: nil)
    end

    it "fails when quant missing" do
      expect(property_without_quant).to have(2).errors_on(:quant)
    end

    it "fails when context missing" do
      expect(property_without_context).to have(2).errors_on(:context)
    end

    it "fails when tooltip_text missing" do
      expect(property_without_tooltip_text).to have(1).errors_on(:tooltip_text)
    end
  end
end
