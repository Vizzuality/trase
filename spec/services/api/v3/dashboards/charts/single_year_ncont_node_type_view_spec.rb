require 'rails_helper'

RSpec.describe Api::V3::Dashboards::Charts::SingleYearNcontNodeTypeView do
  include_context 'api v3 brazil resize by attributes'
  include_context 'api v3 brazil recolor by attributes'
  include_context 'api v3 brazil flows quants'
  include_context 'api v3 brazil flows inds'

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::ResizeByAttribute.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::RecolorByAttribute.refresh(sync: true, skip_dependents: true)
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
        expect(data[0][:x2]).to eq(20)
        expect(data[0][:x3]).to be_nil
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
        expect(data[0][:x2]).to be_nil
        expect(data[0][:x3]).to be_nil
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
        # y0 is the stack for value '1.0'
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
        expect(data[0][:x0]).to eq(nil)
        # y3 is the stack for value '3.0'
        expect(data[0][:x3]).to eq(25)
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
