require 'rails_helper'

RSpec.describe Api::V3::Dashboards::Charts::SingleYearNoNcontOverview do
  include_context 'api v3 brazil resize by attributes'
  include_context 'api v3 brazil soy flow quants'

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::TablePartitions::CreatePartitionsForFlows.new.call
    Api::V3::TablePartitions::CreatePartitionsForFlowQuants.new.call
  end

  let(:cont_attribute) { api_v3_volume.readonly_attribute }

  let(:shared_parameters_hash) {
    {
      country_id: api_v3_brazil.id,
      commodity_id: api_v3_soy.id,
      cont_attribute_id: cont_attribute.id,
      start_year: 2015
    }
  }

  let(:chart_parameters) {
    Api::V3::Dashboards::ChartParameters::FlowValues.new(parameters_hash)
  }

  let(:result) {
    Api::V3::Dashboards::Charts::SingleYearNoNcontOverview.new(
      chart_parameters
    ).call
  }

  let(:data) { result[:data] }

  describe :call do
    context 'when no flow path filters' do
      let(:parameters_hash) { shared_parameters_hash }
      it 'returns total value' do
        expect(data[0][:y0]).to eq(100)
      end
    end

    context 'when filtered by 1 exporter' do
      let(:parameters_hash) {
        shared_parameters_hash.merge(companies_ids: [api_v3_exporter1_node.id])
      }
      it 'it summarized flows matching exporter' do
        expect(data[0][:y0]).to eq(75)
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
      it 'it summarized flows matching exporter' do
        expect(data[0][:y0]).to eq(55)
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
      it 'summarized flows matching either exporter' do
        expect(data[0][:y0]).to eq(100)
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
      it 'summarized flows matching exporter AND importer' do
        expect(data[0][:y0]).to eq(25)
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
      it 'summarized flows matching either exporter AND either importer' do
        expect(data[0][:y0]).to eq(100)
      end
    end
  end
end
