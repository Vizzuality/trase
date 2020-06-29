require 'rails_helper'

RSpec.describe Api::V3::Dashboards::Charts::SingleYearNcontNodeTypeView do
  include_context 'api v3 brazil resize by attributes'
  include_context 'api v3 brazil recolor by attributes'
  include_context 'api v3 brazil soy flow quants'
  include_context 'api v3 brazil soy flow inds'

  before(:each) do
    Api::V3::Readonly::FlowQualDistinctValues.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::TablePartitions::CreatePartitionsForFlows.new.call
    Api::V3::TablePartitions::CreatePartitionsForFlowQuants.new.call
    Api::V3::TablePartitions::CreatePartitionsForFlowInds.new.call
  end

  let(:cont_attribute) { api_v3_volume.readonly_attribute }
  let(:ncont_attribute) { api_v3_forest_500.readonly_attribute }
  let(:node_type) { api_v3_biome_node_type }

  let(:shared_parameters_hash) {
    {
      country_id: api_v3_brazil.id,
      commodity_id: api_v3_soy.id,
      cont_attribute_id: cont_attribute.id,
      ncont_attribute_id: ncont_attribute.id,
      node_type_id: node_type.id,
      start_year: 2015,
      top_n: 10
    }
  }

  let(:chart_parameters) {
    Api::V3::Dashboards::ChartParameters::FlowValues.new(parameters_hash)
  }

  let(:result) {
    Api::V3::Dashboards::Charts::SingleYearNcontNodeTypeView.new(
      chart_parameters
    ).call
  }

  let(:data) { result[:data] }
  let(:meta) { result[:meta] }

  describe :call do
    context 'when no flow path filters' do
      let(:parameters_hash) { shared_parameters_hash }
      it 'summarized all flows per biome' do
        expect(data.size).to eq(1)
        expect(data[0][:y]).to eq('AMAZONIA')
        # x0 is the stack for value '1.0'
        expect(data[0][:x0]).to eq(10)
      end
    end

    context 'when filtered by 1 exporter' do
      let(:parameters_hash) {
        shared_parameters_hash.merge(companies_ids: [api_v3_exporter1_node.id])
      }
      it 'it summarized flows matching exporter per biome' do
        # all flows except flow4 match
        # flow5 forest500=5, volume=30
        expect(meta[:x3][:label]).to eq('5')
        expect(data[0][:x3]).to eq(30)
      end
    end

    context 'when filtered by 1 exporter and 1 destination excluded' do
      let(:parameters_hash) {
        shared_parameters_hash.merge(
          companies_ids: [api_v3_exporter1_node.id],
          excluded_destinations_ids: [
            api_v3_country_of_destination2_node.id
          ]
        )
      }
      it 'it summarized flows matching exporter per biome' do
        # all flows except flow3 and flow4 match
        # flow5 forest500=5, volume=30
        expect(meta[:x2][:label]).to eq('5')
        expect(data[0][:x2]).to eq(30)
      end
    end

    context 'when filtered by 2 exporters' do
      let(:parameters_hash) {
        shared_parameters_hash.merge(
          companies_ids: [
            api_v3_exporter1_node.id, api_v3_exporter2_node.id
          ]
        )
      }
      it 'summarized flows matching either exporter per biome' do
        # all flows match
        # flow 1, forest500=1, volume=10
        expect(meta[:x0][:label]).to eq('1')
        expect(data[0][:x0]).to eq(10)
      end
    end

    context 'when filtered by 1 exporter and 1 importer' do
      let(:parameters_hash) {
        shared_parameters_hash.merge(
          companies_ids: [
            api_v3_exporter2_node.id, api_v3_importer1_node.id
          ]
        )
      }
      it 'summarized flows matching exporter AND importer per biome' do
        # only flow4 matches, forest500=4, volume=25
        expect(meta[:x0][:label]).to eq('4')
        expect(data[0][:x0]).to eq(25)
        expect(meta[:x1]).to be_nil
        expect(data[0][:x1]).to be_nil
      end
    end

    context 'when filtered by 2 exporters and 2 importers' do
      let(:parameters_hash) {
        shared_parameters_hash.merge(
          companies_ids: [
            api_v3_exporter1_node.id,
            api_v3_exporter2_node.id,
            api_v3_importer1_node.id,
            api_v3_importer2_node.id
          ]
        )
      }
      it 'summarized flows matching either exporter AND either importer per biome' do
        # y0 is the stack for value '1.0'
        expect(data[0][:x0]).to eq(10)
      end
    end
  end
end
