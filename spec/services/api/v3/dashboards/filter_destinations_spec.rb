require 'rails_helper'

RSpec.describe Api::V3::Dashboards::FilterDestinations do
  include_context 'api v3 brazil soy flows'
  include_context 'api v3 brazil soy goias flows'
  include_context 'api v3 paraguay flows'
  include_context 'api v3 brazil soy flow quants'
  include_context 'api v3 paraguay flows quants'

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(
      sync: true, skip_dependents: true
    )
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(
      sync: true, skip_dependents: true
    )
    Api::V3::Readonly::NodesPerContextRankedByVolumePerYear.refresh(
      sync: true, skip_dependents: true
    )
    Api::V3::Readonly::Dashboards::Destination.refresh(sync: true)
  end

  describe :call do
    context 'when ordering by volume in single year' do
      let(:filter) {
        Api::V3::Dashboards::FilterDestinations.new(
          node_types_ids: [api_v3_country_node_type.id],
          order_by: 'volume',
          countries_ids: [api_v3_brazil.id],
          commodities_ids: [api_v3_soy.id],
          start_year: 2015
        )
      }
      it 'orders top destination first' do
        nodes = filter.call
        expect(nodes.first.name).to eq(api_v3_country_of_destination1_node.name)
      end
    end
    context 'when ordering by volume in year range' do
      let(:filter) {
        Api::V3::Dashboards::FilterDestinations.new(
          node_types_ids: [api_v3_country_node_type.id],
          order_by: 'volume',
          countries_ids: [api_v3_brazil.id],
          commodities_ids: [api_v3_soy.id],
          start_year: 2015,
          end_year: 2016
        )
      }
      it 'orders top destination first' do
        nodes = filter.call
        expect(nodes.first.name).to eq(api_v3_country_of_destination1_node.name)
      end
    end
    context 'when ordering by name' do
      let(:filter) {
        Api::V3::Dashboards::FilterDestinations.new(
          node_types_ids: [api_v3_country_node_type.id],
          order_by: 'name',
          start_year: 2015
        )
      }
      it 'orders alphabetically' do
        nodes = filter.call
        expect(nodes.first.name).to eq(api_v3_paraguay_country_node.name)
      end
    end
  end
end
