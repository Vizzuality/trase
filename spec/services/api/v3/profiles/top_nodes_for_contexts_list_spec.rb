require 'rails_helper'

RSpec.describe Api::V3::Profiles::TopNodesForContextsList do
  include_context 'api v3 brazil context node types'
  include_context 'api v3 paraguay context node types'
  include_context 'api v3 quants'

  let(:country_of_import_node) {
    node = Api::V3::Node.where(
      name: 'BANGLADESH', node_type_id: api_v3_country_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: 'BANGLADESH',
        node_type: api_v3_country_node_type,
        geo_id: 'BD'
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  }

  let(:exporter_node) {
    node = Api::V3::Node.where(
      name: 'CARGILL', node_type_id: api_v3_exporter_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: 'CARGILL',
        node_type: api_v3_exporter_node_type
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  }

  let(:brazil_flow) {
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_brazil_soy_context,
      path: [
        FactoryBot.create(:api_v3_node, node_type: api_v3_biome_node_type),
        FactoryBot.create(:api_v3_node, node_type: api_v3_state_node_type),
        FactoryBot.create(:api_v3_node, node_type: api_v3_municipality_node_type),
        FactoryBot.create(:api_v3_node, node_type: api_v3_logistics_hub_node_type),
        FactoryBot.create(:api_v3_node, node_type: api_v3_port_node_type),
        exporter_node,
        FactoryBot.create(:api_v3_node, node_type: api_v3_importer_node_type),
        country_of_import_node
      ].map(&:id),
      year: 2015
    )
  }

  let(:paraguay_flow) {
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_paraguay_context,
      path: [
        FactoryBot.create(:api_v3_node, node_type: api_v3_biome_node_type),
        FactoryBot.create(:api_v3_node, node_type: api_v3_department_node_type),
        FactoryBot.create(:api_v3_node, node_type: api_v3_customs_department_node_type),
        exporter_node,
        country_of_import_node
      ].map(&:id),
      year: 2015
    )
  }

  let!(:brazil_flow_volume) {
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: brazil_flow,
      quant: api_v3_volume,
      value: 10
    )
  }

  let!(:paraguay_flow_volume) {
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: paraguay_flow,
      quant: api_v3_volume,
      value: 5
    )
  }

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
    Api::V3::TablePartitions::CreatePartitionsForFlowQuants.new.call
  end

  let(:top_nodes_single_context) {
    Api::V3::Profiles::TopNodesForContextsList.new(
      [api_v3_brazil_soy_context],
      api_v3_exporter_node_type,
      {year_start: 2015, year_end: 2015}
    )
  }

  let(:top_nodes_multiple_contexts) {
    Api::V3::Profiles::TopNodesForContextsList.new(
      [api_v3_brazil_soy_context, api_v3_paraguay_context],
      api_v3_exporter_node_type,
      {year_start: 2015, year_end: 2015}
    )
  }

  describe 'sorted_list' do
    context 'when single soy context' do
      subject { top_nodes_single_context }
      it 'returns total trade for exporter' do
        list = subject.sorted_list(api_v3_volume, include_domestic_consumption: false)
        top = list.first
        expect(top['value']).to eq(10)
      end
    end

    context 'when multiple soy contexts' do
      subject { top_nodes_multiple_contexts }
      it 'returns total trade for exporter' do
        list = subject.sorted_list(api_v3_volume, include_domestic_consumption: false)
        top = list.first
        expect(top['value']).to eq(15)
      end
    end
  end

  describe 'total' do
    context 'when single soy context' do
      subject { top_nodes_single_context }
      it 'returns total trade' do
        total = subject.total(api_v3_volume, include_domestic_consumption: false)
        expect(total).to eq(10)
      end
    end

    context 'when multiple soy contexts' do
      subject { top_nodes_multiple_contexts }
      it 'returns total trade' do
        total = subject.total(api_v3_volume, include_domestic_consumption: false)
        expect(total).to eq(15)
      end
    end
  end
end
