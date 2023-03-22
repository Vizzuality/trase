require "rails_helper"
require "services/api/v3/database_validation/checks/shared_check_examples"

RSpec.describe Api::V3::DatabaseValidation::Checks::HasAtLeastOne do
  let(:context) {
    FactoryBot.create(:api_v3_context)
  }
  let(:report_status) {
    Api::V3::DatabaseValidation::ErrorsList.new
  }

  context "when checking context resize_by_attributes" do
    let(:check) {
      Api::V3::DatabaseValidation::Checks::HasAtLeastOne.new(
        context,
        association: :resize_by_attributes
      )
    }
    context "when resize_by_attributes missing" do
      include_examples "failing checks"
    end

    context "when resize_by_attributes present" do
      let!(:resize_by_attribute) {
        FactoryBot.create(:api_v3_resize_by_attribute, context: context)
      }
      include_examples "passing checks"
    end
  end
end
