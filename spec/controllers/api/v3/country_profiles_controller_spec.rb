require 'rails_helper'

RSpec.describe Api::V3::CountryProfilesController, type: :controller do
  include_context 'api v3 indonesia palm oil profiles'
  include_context 'api v3 indonesia palm oil flows'
  include_context 'api v3 brazil palm oil profiles'
  include_context 'api v3 brazil palm oil flows'

  let(:quant_dict) { instance_double(Dictionary::Quant) }
  let(:chart_config) {
    instance_double(Api::V3::Profiles::ChartConfiguration)
  }

  before(:each) do
    allow(Api::V3::Profiles::GetTooltipPerAttribute).to(
      receive(:call).and_return('TOOLTIP')
    )
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true, skip_dependencies: true)
  end

  context 'when exporter' do
    let(:node) { api_v3_brazil_palm_oil_country_of_production_node }
    let(:year) { 2015 }
    let(:valid_params) {
      {context_id: api_v3_context.id, id: node.id, year: year}
    }

    describe 'GET top_consumer_actors' do
      context 'when trader node type configuration missing' do
        it 'is not found' do
          allow(Api::V3::Profiles::ChartConfiguration).to(
            receive(:new).and_return(chart_config)
          )
          allow(chart_config).to(
            receive(:named_node_type).with('trader').and_return(nil)
          )

          get :top_consumer_actors, params: valid_params
          expect(response).to have_http_status(404)
        end
      end
    end

    describe 'GET top_consumer_countries' do
      context 'when destination node type configuration missing' do
        it 'is not found' do
          allow(Api::V3::Profiles::ChartConfiguration).to(
            receive(:new).and_return(chart_config)
          )
          allow(chart_config).to(
            receive(:named_node_type).with('destination').and_return(nil)
          )

          get :top_consumer_countries, params: valid_params
          expect(response).to have_http_status(404)
        end
      end
    end
  end

  context 'when importer' do
    let(:node) { api_v3_indonesia_country_node }
    let(:year) { 2015 }
    let(:valid_params) {
      {context_id: api_v3_context.id, id: node.id, year: year}
    }

    describe 'GET top_consumer_actors' do
      context 'when trader node type configuration missing' do
        it 'is not found' do
          allow(Api::V3::Profiles::ChartConfiguration).to(
            receive(:new).and_return(chart_config)
          )
          allow(chart_config).to(
            receive(:named_node_type).with('trader').and_return(nil)
          )

          get :top_consumer_actors, params: valid_params
          expect(response).to have_http_status(404)
        end
      end
    end

    describe 'GET top_consumer_countries' do
      context 'when destination node type configuration missing' do
        it 'is not found' do
          allow(Api::V3::Profiles::ChartConfiguration).to(
            receive(:new).and_return(chart_config)
          )
          allow(chart_config).to(
            receive(:named_node_type).with('destination').and_return(nil)
          )

          get :top_consumer_countries, params: valid_params
          expect(response).to have_http_status(404)
        end
      end
    end
  end
end
