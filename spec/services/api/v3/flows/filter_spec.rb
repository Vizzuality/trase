require "rails_helper"

RSpec.describe Api::V3::Flows::Filter do
  include_context "api v3 brazil resize by attributes"
  include_context "api v3 brazil recolor by attributes"
  include_context "api v3 brazil soy flow quants"

  let!(:api_v3_diamantino_node) {
    node = Api::V3::Node.where(
      name: "DIAMANTINO", node_type_id: api_v3_municipality_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "DIAMANTINO",
        node_type: api_v3_municipality_node_type,
        geo_id: "BR5103502"
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  }

  let!(:api_v3_diamantino_flow) {
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_brazil_soy_context,
      path: [
        api_v3_brazil_soy_country_of_production_node,
        api_v3_biome_node,
        api_v3_state_node,
        api_v3_diamantino_node,
        api_v3_logistics_hub_node,
        api_v3_port1_node,
        api_v3_exporter1_node,
        api_v3_importer1_node,
        api_v3_country_of_first_import_node_ru
      ].map(&:id),
      year: 2015
    )
  }

  let!(:api_v3_diamantino_flow_volume) {
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_diamantino_flow,
      quant: api_v3_volume,
      value: 0.1
    )
  }

  before(:each) do
    Api::V3::Readonly::FlowQualDistinctValues.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::TablePartitions::CreatePartitionsForFlows.new.call
    Api::V3::TablePartitions::CreatePartitionsForFlowQuants.new.call
  end

  describe :active_nodes do
    let(:node_types) {
      [
        api_v3_municipality_node_type,
        api_v3_exporter_node_type,
        api_v3_importer_node_type,
        api_v3_country_of_first_import_node_type
      ]
    }

    let(:node_types_positions) {
      [3,6,7,8]
    }

    let(:filter_params) {
      {
        year_start: 2015,
        year_end: 2015,
        node_types_ids: node_types.map(&:id),
        cont_attribute_id: api_v3_volume.readonly_attribute.id,
        limit: 5
      }
    }

    let(:locked_nodes) {
      {locked_nodes_ids: [api_v3_diamantino_node.id]}
    }

    context "when overview mode" do
      context "when no locked nodes present" do
        it "does not include low volume nodes in active nodes" do
          filter = Api::V3::Flows::Filter.new(
            api_v3_brazil_soy_context,
            filter_params.merge(limit: 1)
          )
          filter.call

          expect(filter.active_nodes).not_to have_key(api_v3_diamantino_node.id)
        end
      end
      context "when locked nodes" do
        it "includes locked low volume nodes in active nodes" do
          filter = Api::V3::Flows::Filter.new(
            api_v3_brazil_soy_context,
            filter_params.merge(locked_nodes)
          )
          filter.call
          expect(filter.active_nodes).to have_key(api_v3_diamantino_node.id)
        end
      end
      context "when recolor by attribute" do
        it "includes flows with null value of recolor by attribute" do
          filter = Api::V3::Flows::Filter.new(
            api_v3_brazil_soy_context,
            filter_params.merge(
              ncont_attribute_id: api_v3_forest_500_recolor_by_attribute.readonly_attribute.id
            )
          )
          filter.call
          paths = filter.flows.map(&:path)
          diamantino_path =
            api_v3_diamantino_flow.path.select.with_index do |id, position|
              node_types_positions.include?(position)
            end
          expect(paths).to include(diamantino_path)
        end
      end
    end

    context "when expanded mode" do
      let(:expanded_nodes) {
        {selected_nodes_ids: [api_v3_country_of_first_import_node_ru.id]}
      }

      context "when no locked nodes present" do
        it "does not include low volume nodes in active nodes" do
          filter = Api::V3::Flows::Filter.new(
            api_v3_brazil_soy_context,
            filter_params.merge(expanded_nodes).merge(limit: 1)
          )
          filter.call
          expect(filter.active_nodes).not_to have_key(api_v3_diamantino_node.id)
        end
      end

      context "when locked nodes" do
        it "includes locked low volume nodes in active nodes" do
          filter = Api::V3::Flows::Filter.new(
            api_v3_brazil_soy_context,
            filter_params.merge(expanded_nodes).merge(locked_nodes)
          )
          filter.call
          expect(filter.active_nodes).to have_key(api_v3_diamantino_node.id)
        end
      end
    end

    context "when excluded nodes" do
      let(:excluded_nodes) {
        {excluded_nodes_ids: [api_v3_country_of_first_import_node_ru.id]}
      }

      it "does not include paths with excluded nodes" do
        filter = Api::V3::Flows::Filter.new(
          api_v3_brazil_soy_context,
          filter_params.merge(excluded_nodes)
        )
        result = filter.call
        result.data.each do |flow|
          expect(flow[:path]).not_to include(api_v3_country_of_first_import_node_ru.id)
        end
      end
    end

    context "when required options missing" do
      context "node_type_ids missing" do
        let(:filter) { Api::V3::Flows::Filter.new(api_v3_brazil_soy_context, {}) }
        it "should have errors set" do
          filter.call
          expect(filter.errors).not_to be_empty
        end
        it "should return no flows" do
          filter.call
          expect(filter.flows).to be_nil
        end
      end
    end
  end
end
