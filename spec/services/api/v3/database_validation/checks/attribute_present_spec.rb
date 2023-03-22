require "rails_helper"
require "services/api/v3/database_validation/checks/shared_check_examples"

RSpec.describe Api::V3::DatabaseValidation::Checks::AttributePresent do
  context "when checking quants" do
    let(:quant) {
      FactoryBot.create(:api_v3_quant)
    }
    let(:check) {
      Api::V3::DatabaseValidation::Checks::AttributePresent.new(
        quant,
        attribute: :tooltip_text,
        on: :quant_property
      )
    }
    let(:report_status) {
      Api::V3::DatabaseValidation::ErrorsList.new
    }
    context "when tooltip_text missing" do
      let!(:quant_property) {
        FactoryBot.create(
          :api_v3_quant_property, quant: quant, tooltip_text: nil
        )
      }
      include_examples "failing checks"
    end

    context "when tooltip_text present" do
      let!(:quant_property) {
        FactoryBot.create(
          :api_v3_quant_property, quant: quant, tooltip_text: "test"
        )
      }
      include_examples "passing checks"
    end
  end
end
