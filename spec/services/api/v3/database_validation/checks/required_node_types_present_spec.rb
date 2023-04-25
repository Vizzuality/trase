require "rails_helper"
require "services/api/v3/database_validation/checks/shared_check_examples"

RSpec.describe Api::V3::DatabaseValidation::Checks::RequiredNodeTypesPresent do
  include_context "api v3 node types"

  context "when checking contexts" do
    let(:context) {
      FactoryBot.create(:api_v3_context)
    }
    let(:check) {
      Api::V3::DatabaseValidation::Checks::RequiredNodeTypesPresent.new(
        context
      )
    }
    let(:report_status) {
      Api::V3::DatabaseValidation::ErrorsList.new
    }
    context "when node types missing" do
      include_examples "failing checks"
    end

    context "when node types present" do
      let!(:exporter_context_node_type) {
        FactoryBot.create(
          :api_v3_context_node_type,
          context: context,
          node_type: api_v3_exporter_node_type
        )
      }
      let!(:country_context_node_type) {
        FactoryBot.create(
          :api_v3_context_node_type,
          context: context,
          node_type: api_v3_country_node_type
        )
      }
      include_examples "passing checks"
    end
  end
end
