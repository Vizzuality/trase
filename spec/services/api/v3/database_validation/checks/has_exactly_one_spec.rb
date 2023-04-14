require "rails_helper"
require "services/api/v3/database_validation/checks/shared_check_examples"

RSpec.describe Api::V3::DatabaseValidation::Checks::HasExactlyOne do
  context "when checking contexts" do
    let(:context) {
      FactoryBot.create(:api_v3_context)
    }
    let(:check) {
      Api::V3::DatabaseValidation::Checks::HasExactlyOne.new(
        context,
        association: :context_property
      )
    }
    let(:report_status) {
      Api::V3::DatabaseValidation::ErrorsList.new
    }
    context "when context property missing" do
      include_examples "failing checks"
    end

    context "when context property present" do
      let!(:context_property) {
        FactoryBot.create(:api_v3_context_property, context: context)
      }
      include_examples "passing checks"
    end
  end
end
