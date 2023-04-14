require "rails_helper"

RSpec.describe Api::V3::Dashboards::ParametrisedCharts::NodeTypesToBreakBy do
  include_context "api v3 node types"

  let(:context) { FactoryBot.create(:api_v3_context) }

  let!(:exporter_node_type) {
    cnt = FactoryBot.create(
      :api_v3_context_node_type, context: context, node_type: api_v3_exporter_node_type
    )
    FactoryBot.create(
      :api_v3_context_node_type_property, context_node_type: cnt, column_group: 1, role: "exporter"
    )
  }

  let!(:destination_node_type) {
    cnt = FactoryBot.create(
      :api_v3_context_node_type, context: context, node_type: api_v3_country_node_type
    )
    FactoryBot.create(
      :api_v3_context_node_type_property, context_node_type: cnt, column_group: 3, role: "destination"
    )
  }

  let(:biome_node) {
    FactoryBot.create(:api_v3_node, node_type: api_v3_biome_node_type)
  }
  let(:exporter_node) {
    FactoryBot.create(:api_v3_node, node_type: api_v3_exporter_node_type)
  }
  let(:importer_node) {
    FactoryBot.create(:api_v3_node, node_type: api_v3_importer_node_type)
  }
  let(:country_node) {
    FactoryBot.create(:api_v3_node, node_type: api_v3_country_node_type)
  }

  describe "selected_node_types" do
    context "when subnational context with importer node" do
      let!(:source_node_type) {
        cnt = FactoryBot.create(
          :api_v3_context_node_type, context: context, node_type: api_v3_biome_node_type
        )
        FactoryBot.create(
          :api_v3_context_node_type_property, context_node_type: cnt, column_group: 0, role: "source"
        )
      }
      let!(:another_source_node_type) {
        cnt = FactoryBot.create(
          :api_v3_context_node_type, context: context, node_type: api_v3_state_node_type
        )
        FactoryBot.create(
          :api_v3_context_node_type_property, context_node_type: cnt, column_group: 0, role: "source"
        )
      }
      let!(:importer_node_type) {
        cnt = FactoryBot.create(
          :api_v3_context_node_type, context: context, node_type: api_v3_importer_node_type
        )
        FactoryBot.create(
          :api_v3_context_node_type_property, context_node_type: cnt, column_group: 2, role: "importer"
        )
      }

      let(:node_types_to_break_by) {
        Api::V3::Dashboards::ParametrisedCharts::NodeTypesToBreakBy.new(
          context,
          [biome_node, exporter_node, importer_node, country_node]
        )
      }
      it "returns available node types to break by" do
        expect(node_types_to_break_by.selected_node_types).to match_array([
          api_v3_biome_node_type,
          api_v3_exporter_node_type,
          api_v3_importer_node_type,
          api_v3_country_node_type
        ])
      end
    end

    context "when national context with importer node" do
      let!(:importer_node_type) {
        cnt = FactoryBot.create(
          :api_v3_context_node_type, context: context, node_type: api_v3_importer_node_type
        )
        FactoryBot.create(
          :api_v3_context_node_type_property, context_node_type: cnt, column_group: 2, role: "importer"
        )
      }

      let(:node_types_to_break_by) {
        Api::V3::Dashboards::ParametrisedCharts::NodeTypesToBreakBy.new(
          context,
          [exporter_node, importer_node, country_node]
        )
      }
      it "returns available node types to break by" do
        expect(node_types_to_break_by.selected_node_types).to match_array([
          api_v3_exporter_node_type,
          api_v3_importer_node_type,
          api_v3_country_node_type
        ])
      end
    end

    context "when subnational context without importer node" do
      let!(:source_node_type) {
        cnt = FactoryBot.create(
          :api_v3_context_node_type, context: context, node_type: api_v3_biome_node_type
        )
        FactoryBot.create(
          :api_v3_context_node_type_property, context_node_type: cnt, column_group: 0, role: "source"
        )
      }
      let!(:another_source_node_type) {
        cnt = FactoryBot.create(
          :api_v3_context_node_type, context: context, node_type: api_v3_state_node_type
        )
        FactoryBot.create(
          :api_v3_context_node_type_property, context_node_type: cnt, column_group: 0, role: "source"
        )
      }

      let(:node_types_to_break_by) {
        Api::V3::Dashboards::ParametrisedCharts::NodeTypesToBreakBy.new(
          context,
          [biome_node, exporter_node, country_node]
        )
      }
      it "returns available node types to break by" do
        expect(node_types_to_break_by.selected_node_types).to match_array([
          api_v3_biome_node_type,
          api_v3_exporter_node_type,
          api_v3_country_node_type
        ])
      end
    end

    context "when national context without importer node" do
      let(:node_types_to_break_by) {
        Api::V3::Dashboards::ParametrisedCharts::NodeTypesToBreakBy.new(
          context,
          [exporter_node, country_node]
        )
      }
      it "returns available node types to break by" do
        expect(node_types_to_break_by.selected_node_types).to match_array([
          api_v3_exporter_node_type,
          api_v3_country_node_type
        ])
      end
    end
  end
end
