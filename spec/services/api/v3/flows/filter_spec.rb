require 'rails_helper'

RSpec.describe Api::V3::Flows::Filter do
  before(:all) { Api::V3::Flow.delete_all } # db clearing doesn't seem to work }
  include_context 'api v3 brazil flows quants'

  let!(:api_v3_diamantino_node) {
    node = Api::V3::Node.where(
      name: 'DIAMANTINO', node_type_id: api_v3_municipality_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: 'DIAMANTINO',
        node_type: api_v3_municipality_node_type,
        geo_id: 'BR5103502'
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
      context: api_v3_context,
      path: [
        api_v3_biome_node,
        api_v3_state_node,
        api_v3_diamantino_node,
        api_v3_logistics_hub_node,
        api_v3_port1_node,
        api_v3_exporter1_node,
        api_v3_importer1_node,
        api_v3_country_of_destination1_node
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

  describe :active_nodes do
    let(:node_types) {
      [
        api_v3_municipality_node_type,
        api_v3_exporter_node_type,
        api_v3_importer_node_type,
        api_v3_country_node_type
      ]
    }

    let(:filter_params) {
      {
        year_start: 2015,
        year_end: 2015,
        node_types_ids: node_types.map(&:id),
        resize_quant_name: api_v3_volume.name,
        limit: 1
      }
    }

    let(:locked_nodes) {
      {locked_nodes_ids: [api_v3_diamantino_node.id]}
    }

    context 'when overview mode' do
      context 'when no locked nodes present' do
        it 'does not include low volume nodes in active nodes' do
          filter = Api::V3::Flows::Filter.new(
            api_v3_context,
            filter_params
          )
          filter.call
          expect(filter.active_nodes).not_to have_key(api_v3_diamantino_node.id)
        end
      end
      context 'when locked nodes' do
        it 'includes locked low volume nodes in active nodes' do
          filter = Api::V3::Flows::Filter.new(
            api_v3_context,
            filter_params.merge(locked_nodes)
          )
          filter.call
          expect(filter.active_nodes).to have_key(api_v3_diamantino_node.id)
        end
      end
    end

    context 'when expanded mode' do
      let(:expanded_nodes) {
        {selected_nodes_ids: [api_v3_country_of_destination1_node.id]}
      }
      context 'when no locked nodes present' do
        it 'does not include low volume nodes in active nodes' do
          filter = Api::V3::Flows::Filter.new(
            api_v3_context,
            filter_params.merge(expanded_nodes)
          )
          filter.call
          expect(filter.active_nodes).not_to have_key(api_v3_diamantino_node.id)
        end
      end
      context 'when locked nodes' do
        it 'includes locked low volume nodes in active nodes' do
          filter = Api::V3::Flows::Filter.new(
            api_v3_context,
            filter_params.merge(expanded_nodes).merge(locked_nodes)
          )
          filter.call
          expect(filter.active_nodes).to have_key(api_v3_diamantino_node.id)
        end
      end
    end

    context 'when required options missing' do
      context 'node_type_ids missing' do
        let(:filter) { Api::V3::Flows::Filter.new(api_v3_context, {}) }
        it 'should have errors set' do
          filter.call
          expect(filter.errors).not_to be_empty
        end
        it 'should return no flows' do
          filter.call
          expect(filter.flows).to be_nil
        end
      end
    end
  end
end
