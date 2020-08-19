require 'rails_helper'

RSpec.describe 'Exporter profile', type: :request do
  include_context 'api v3 brazil exporter quant values'
  include_context 'api v3 brazil exporter qual values'
  include_context 'api v3 brazil exporter ind values'
  include_context 'api v3 brazil municipality quant values'
  include_context 'api v3 brazil municipality qual values'
  include_context 'api v3 brazil municipality ind values'
  include_context 'api v3 brazil soy flow quants'
  include_context 'api v3 brazil exporter actor profile'

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)

    NodeWithFlowsRefreshActorBasicAttributesWorker.new.perform(
      Api::V3::Readonly::NodeWithFlows.where(profile: :actor).map(&:id)
    )
  end

  let(:summary_params) { {year: 2015} }

  describe 'GET /api/v3/contexts/:context_id/actors/:id/basic_attributes' do
    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_brazil_soy_context.id}/actors/#{api_v3_exporter1_node.id}/basic_attributes",
        params: summary_params

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('v3_actor_basic_attributes')
    end
  end

  describe 'GET /api/v3/contexts/:context_id/actors/:id/top_countries' do
    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_brazil_soy_context.id}/actors/#{api_v3_exporter1_node.id}/top_countries", params: summary_params

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('v3_actor_top_countries')
    end
  end

  describe 'GET /api/v3/contexts/:context_id/actors/:id/top_sources' do
    let(:unknown_municipality) {
      FactoryBot.create(
        :api_v3_node,
        node_type: api_v3_municipality_node_type,
        is_unknown: true
      )
    }
    let!(:flow_2014) {
      FactoryBot.create(
        :api_v3_flow,
        context: api_v3_brazil_soy_context,
        path: [
          api_v3_biome_node,
          api_v3_state_node,
          unknown_municipality,
          api_v3_logistics_hub_node,
          api_v3_port1_node,
          api_v3_exporter1_node,
          api_v3_importer1_node,
          api_v3_country_of_destination1_node
        ].map(&:id),
        year: 2014
      )
    }
    let!(:flow_2014_volume) {
      FactoryBot.create(
        :api_v3_flow_quant,
        flow: flow_2014,
        quant: api_v3_volume,
        value: 10
      )
    }
    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_brazil_soy_context.id}/actors/#{api_v3_exporter1_node.id}/top_sources", params: summary_params

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('v3_actor_top_sources')
    end
  end

  describe 'GET /api/v3/contexts/:context_id/actors/:id/sustainability' do
    before(:each) do
      Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    end
    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_brazil_soy_context.id}/actors/#{api_v3_exporter1_node.id}/sustainability", params: summary_params

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('v3_actor_sustainability')
    end
  end

  describe 'GET /api/v3/contexts/:context_id/actors/:id/exporting_companies' do
    before(:each) do
      Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    end
    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_brazil_soy_context.id}/actors/#{api_v3_exporter1_node.id}/exporting_companies", params: summary_params

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('v3_actor_exporting_companies')
    end
  end
end
