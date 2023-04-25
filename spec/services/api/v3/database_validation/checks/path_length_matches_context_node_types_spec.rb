require "rails_helper"
require "services/api/v3/database_validation/checks/shared_check_examples"

RSpec.describe Api::V3::DatabaseValidation::Checks::PathLengthMatchesContextNodeTypes do
  include_context "api v3 node types"
  let(:context) { FactoryBot.create(:api_v3_context) }

  let!(:context_node_type_1) {
    FactoryBot.create(
      :api_v3_context_node_type,
      context: context,
      node_type: api_v3_biome_node_type,
      column_position: 0
    )
  }
  let!(:context_node_type_2) {
    FactoryBot.create(
      :api_v3_context_node_type,
      context: context,
      node_type: api_v3_state_node_type,
      column_position: 1
    )
  }
  let!(:context_node_type_3) {
    FactoryBot.create(
      :api_v3_context_node_type,
      context: context,
      node_type: api_v3_municipality_node_type,
      column_position: 2
    )
  }
  let!(:context_node_type_4) {
    FactoryBot.create(
      :api_v3_context_node_type,
      context: context,
      node_type: api_v3_exporter_node_type,
      column_position: 3
    )
  }
  let!(:context_node_type_5) {
    FactoryBot.create(
      :api_v3_context_node_type,
      context: context,
      node_type: api_v3_country_node_type,
      column_position: 4
    )
  }
  let(:node_1) {
    FactoryBot.create(:api_v3_node, node_type: context_node_type_1.node_type)
  }
  let(:node_2) {
    FactoryBot.create(:api_v3_node, node_type: context_node_type_2.node_type)
  }
  let(:node_3) {
    FactoryBot.create(:api_v3_node, node_type: context_node_type_3.node_type)
  }
  let(:node_4) {
    FactoryBot.create(:api_v3_node, node_type: context_node_type_4.node_type)
  }
  let(:node_5) {
    FactoryBot.create(:api_v3_node, node_type: context_node_type_5.node_type)
  }
  let(:check) {
    Api::V3::DatabaseValidation::Checks::PathLengthMatchesContextNodeTypes.new(
      context
    )
  }
  let(:report_status) {
    Api::V3::DatabaseValidation::ErrorsList.new
  }

  context "path length matches context node types" do
    let!(:flow) {
      FactoryBot.create(
        :api_v3_flow,
        context: context,
        path: [node_1, node_2, node_3, node_4, node_5].map(&:id)
      )
    }
    include_examples "passing checks"
  end

  context "path length too short" do
    let!(:flow) {
      FactoryBot.create(
        :api_v3_flow,
        context: context,
        path: [node_1, node_2, node_3, node_4].map(&:id)
      )
    }
    include_examples "failing checks"
  end

  context "path length too long" do
    let(:node_6) { FactoryBot.create(:api_v3_node) }
    let!(:flow) {
      FactoryBot.create(
        :api_v3_flow,
        context: context,
        path: [node_1, node_2, node_3, node_4, node_5, node_6].map(&:id)
      )
    }
    include_examples "failing checks"
  end
end
