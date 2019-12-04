require 'rails_helper'

RSpec.describe Api::V3::PlacesController, type: :controller do
  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil municipality place profile'

  let(:node) { api_v3_municipality_node }
  let(:year) { 2015 }

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true, skip_dependencies: true)
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::ChartAttribute.refresh(sync: true, skip_dependencies: true)
  end

  describe 'GET basic_attributes' do
    context 'when node without flows' do
      let(:node) {
        node = FactoryBot.create(
          :api_v3_node, node_type: api_v3_municipality_node_type
        )
        FactoryBot.create(:api_v3_node_property, node: node)
        node
      }

      it 'is not found' do
        get :basic_attributes, params: {
          context_id: api_v3_context.id, place_id: node.id, year: year
        }
        expect(response).to have_http_status(404)
      end
    end

    context 'when node without place profile' do
      let(:node) { api_v3_exporter1_node }

      it 'is not found' do
        get :basic_attributes, params: {
          context_id: api_v3_context.id, place_id: node.id, year: year
        }
        expect(response).to have_http_status(404)
      end
    end

    context 'when year provided and valid for node' do
      it 'is successful' do
        get :basic_attributes, params: {
          context_id: api_v3_context.id, place_id: node.id, year: year
        }
        expect(response).to be_successful
      end
    end

    context 'when year provided but not valid for node' do
      it 'defaults to last available' do
        get :basic_attributes, params: {
          context_id: api_v3_context.id, place_id: node.id, year: 2016
        }
        expect(assigns(:year)).to eq(year)
        expect(response).to be_successful
      end
    end

    context 'when year not provided' do
      it 'defaults to last available' do
        get :basic_attributes, params: {
          context_id: api_v3_context.id, place_id: node.id
        }
        expect(assigns(:year)).to eq(year)
        expect(response).to be_successful
      end
    end
  end
end
