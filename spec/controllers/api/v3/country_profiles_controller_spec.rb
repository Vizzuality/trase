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
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
  end

  context 'when exporter' do
    let(:node) { api_v3_brazil_palm_oil_country_of_production_node }
    let(:year) { 2015 }
    let(:valid_params) {
      {context_id: api_v3_brazil_palm_oil_context.id, id: node.id, year: year}
    }

    describe 'GET basic_attributes' do
      context 'when node without flows' do
        let(:node) {
          node = FactoryBot.create(
            :api_v3_node, node_type: api_v3_country_of_production_node_type
          )
          FactoryBot.create(:api_v3_node_property, node: node)
          node
        }

        it 'is not found' do
          get :basic_attributes, params: valid_params
          expect(response).to have_http_status(404)
        end
      end
    end

    describe 'GET commodity_exports' do
      context 'when node without flows' do
        let(:node) {
          node = FactoryBot.create(
            :api_v3_node, node_type: api_v3_country_of_production_node_type
          )
          FactoryBot.create(:api_v3_node_property, node: node)
          node
        }

        it 'is not found' do
          get :commodity_exports, params: valid_params
          expect(response).to have_http_status(404)
        end
      end
    end

    describe 'GET trajectory_deforestation' do
      context 'when node without flows' do
        let(:node) {
          node = FactoryBot.create(
            :api_v3_node, node_type: api_v3_country_of_production_node_type
          )
          FactoryBot.create(:api_v3_node_property, node: node)
          node
        }

        it 'is not found' do
          get :trajectory_deforestation, params: valid_params
          expect(response).to have_http_status(404)
        end
      end
    end

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

    describe 'GET indicators' do
      context 'when node without country profile' do
        let(:node) { api_v3_brazil_palm_oil_exporter_node }

        it 'is not found' do
          get :indicators, params: valid_params
          expect(response).to have_http_status(404)
        end
      end
    end
  end

  context 'when importer' do
    let(:node) { api_v3_indonesia_country_node }
    let(:year) { 2015 }
    let(:valid_params) {
      {context_id: api_v3_brazil_soy_context.id, id: node.id, year: year}
    }

    describe 'GET basic_attributes' do
      context 'when node without flows' do
        let(:node) {
          node = FactoryBot.create(
            :api_v3_node, node_type: api_v3_country_node_type
          )
          FactoryBot.create(:api_v3_node_property, node: node)
          node
        }

        it 'is not found' do
          get :basic_attributes, params: valid_params
          expect(response).to have_http_status(404)
        end
      end
    end

    describe 'GET commodity_imports' do
      context 'when node without flows' do
        let(:node) {
          node = FactoryBot.create(
            :api_v3_node, node_type: api_v3_country_of_production_node_type
          )
          FactoryBot.create(:api_v3_node_property, node: node)
          node
        }

        it 'is not found' do
          get :commodity_imports, params: valid_params
          expect(response).to have_http_status(404)
        end
      end
    end

    describe 'GET trajectory_import' do
      context 'when node without flows' do
        let(:node) {
          node = FactoryBot.create(
            :api_v3_node, node_type: api_v3_country_of_production_node_type
          )
          FactoryBot.create(:api_v3_node_property, node: node)
          node
        }

        it 'is not found' do
          get :trajectory_import, params: valid_params
          expect(response).to have_http_status(404)
        end
      end
    end

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
