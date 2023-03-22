require "rails_helper"
require "services/api/v3/database_validation/checks/shared_check_examples"

RSpec.describe Api::V3::DatabaseValidation::Checks::HasAtLeastOneProfile do
  let(:context) {
    FactoryBot.create(:api_v3_context)
  }
  let(:report_status) {
    Api::V3::DatabaseValidation::ErrorsList.new
  }

  context "when checking context actor profiles" do
    let!(:context_node_type) {
      FactoryBot.create(:api_v3_context_node_type, context: context)
    }
    let(:check) {
      Api::V3::DatabaseValidation::Checks::HasAtLeastOneProfile.new(
        context,
        profile_type: :actor,
        severity: :warn
      )
    }

    context "when actor profile missing" do
      include_examples "failing checks (warnings)"
    end

    context "when actor profile present" do
      let!(:actor_profile) {
        FactoryBot.create(
          :api_v3_profile,
          context_node_type: context_node_type,
          name: Api::V3::Profile::ACTOR
        )
      }
      include_examples "passing checks (warnings)"
    end
  end
end
