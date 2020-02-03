require 'rails_helper'

RSpec.describe Api::V3::ActorsController, type: :controller do
  include_context 'api v3 brazil exporter quant values'
  include_context 'api v3 brazil exporter qual values'
  include_context 'api v3 brazil exporter ind values'
  include_context 'api v3 brazil municipality quant values'
  include_context 'api v3 brazil municipality qual values'
  include_context 'api v3 brazil municipality ind values'
  include_context 'api v3 brazil flows quants'
  include_context 'api v3 brazil exporter actor profile'

  let(:node) { api_v3_exporter1_node }
  let(:year) { 2015 }
  let(:valid_params) {
    {context_id: api_v3_context.id, actor_id: node.id, year: year}
  }
  let(:quant_dict) { instance_double(Dictionary::Quant) }
  let(:chart_config) {
    instance_double(Api::V3::Profiles::ChartConfiguration)
  }

  before(:each) do
    Api::V3::Readonly::CommodityAttributeProperty.refresh
    Api::V3::Readonly::CountryAttributeProperty.refresh
    Api::V3::Readonly::ContextAttributeProperty.refresh
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
        get :basic_attributes, params: valid_params
        expect(response).to have_http_status(404)
      end
    end

    context 'when node without actor profile' do
      let(:node) { api_v3_municipality_node }

      it 'is not found' do
        get :basic_attributes, params: valid_params
        expect(response).to have_http_status(404)
      end
    end

    context 'when Volume quant missing' do
      it 'is not found' do
        allow(Dictionary::Quant).to receive(:instance).and_return(quant_dict)
        allow(quant_dict).to receive(:get).and_return(nil)

        get :basic_attributes, params: valid_params
        expect(response).to have_http_status(404)
      end
    end

    context 'when source node type configuration missing' do
      it 'is not found' do
        allow(Api::V3::Profiles::ChartConfiguration).to(
          receive(:new).and_return(chart_config)
        )
        allow(chart_config).to(
          receive(:named_node_type).with('source').and_return(nil)
        )

        get :basic_attributes, params: valid_params
        expect(response).to have_http_status(404)
      end
    end

    context 'when destination node type configuration missing' do
      it 'is not found' do
        allow(Api::V3::Profiles::ChartConfiguration).to(
          receive(:new).and_return(chart_config)
        )
        allow(chart_config).to(
          receive(:named_node_type).
            with('source').
            and_return(api_v3_municipality_node_type)
        )
        allow(chart_config).to(
          receive(:named_node_type).with('destination').and_return(nil)
        )

        get :basic_attributes, params: valid_params
        expect(response).to have_http_status(404)
      end
    end

    context 'when year provided and valid for node' do
      it 'is successful' do
        get :basic_attributes, params: valid_params
        expect(response).to be_successful
      end
    end

    context 'when year provided but not valid for node' do
      it 'defaults to last available' do
        get :basic_attributes, params: valid_params.merge(year: 2016)
        expect(assigns(:year)).to eq(year)
        expect(response).to be_successful
      end
    end

    context 'when year not provided' do
      it 'defaults to last available' do
        get :basic_attributes, params: valid_params.except(:year)
        expect(assigns(:year)).to eq(year)
        expect(response).to be_successful
      end
    end
  end

  describe 'GET exporting_companies' do
    context 'when Volume quant missing' do
      it 'is not found' do
        allow(Dictionary::Quant).to receive(:instance).and_return(quant_dict)
        allow(quant_dict).to receive(:get).and_return(nil)

        get :exporting_companies, params: valid_params
        expect(response).to have_http_status(404)
      end
    end

    context 'when attributes configuration missing' do
      it 'is not found' do
        allow(Api::V3::Profiles::ChartConfiguration).to(
          receive(:new).and_return(chart_config)
        )
        allow(chart_config).to(
          receive(:attributes).and_return([])
        )

        get :exporting_companies, params: valid_params
        expect(response).to have_http_status(404)
      end
    end
  end

  describe 'GET sustainability' do
    context 'when Volume quant missing' do
      it 'is not found' do
        allow(Dictionary::Quant).to receive(:instance).and_return(quant_dict)
        allow(quant_dict).to receive(:get).and_return(nil)

        get :sustainability, params: valid_params
        expect(response).to have_http_status(404)
      end
    end

    context 'when source node type configuration missing' do
      it 'is not found' do
        allow(Api::V3::Profiles::ChartConfiguration).to(
          receive(:new).and_return(chart_config)
        )
        allow(chart_config).to(
          receive(:attributes)
        ).and_return([api_v3_potential_soy_deforestation_v2])
        allow(chart_config).to(
          receive(:named_node_types).with('source').and_return([])
        )

        get :sustainability, params: valid_params
        expect(response).to have_http_status(404)
      end
    end

    context 'when attributes configuration missing' do
      it 'is not found' do
        allow(Api::V3::Profiles::ChartConfiguration).to(
          receive(:new).and_return(chart_config)
        )
        allow(chart_config).to(
          receive(:attributes).and_return([])
        )

        get :sustainability, params: valid_params
        expect(response).to have_http_status(404)
      end
    end
  end

  describe 'GET top_countries' do
    context 'when Volume quant missing' do
      it 'is not found' do
        allow(Dictionary::Quant).to receive(:instance).and_return(quant_dict)
        allow(quant_dict).to receive(:get).and_return(nil)

        get :top_countries, params: valid_params
        expect(response).to have_http_status(404)
      end
    end

    context 'when destination node type configuration missing' do
      it 'is not found' do
        allow(Api::V3::Profiles::ChartConfiguration).to(
          receive(:new).and_return(chart_config)
        )
        allow(chart_config).to(
          receive(:named_node_type).with('destination').and_return(nil)
        )

        get :top_countries, params: valid_params
        expect(response).to have_http_status(404)
      end
    end

    context 'when named attribute configuration missing' do
      it 'is not found' do
        allow(Api::V3::Profiles::ChartConfiguration).to(
          receive(:new).and_return(chart_config)
        )
        allow(chart_config).to(
          receive(:named_node_type).
            with('destination').
            and_return(api_v3_country_node_type)
        )
        allow(chart_config).to(
          receive(:named_attribute).
            with('commodity_production').
            and_return(nil)
        )

        get :top_countries, params: valid_params
        expect(response).to have_http_status(404)
      end
    end
  end

  describe 'GET top_sources' do
    context 'when Volume quant missing' do
      it 'is not found' do
        allow(Dictionary::Quant).to receive(:instance).and_return(quant_dict)
        allow(quant_dict).to receive(:get).and_return(nil)

        get :top_sources, params: valid_params
        expect(response).to have_http_status(404)
      end
    end

    context 'when source node type configuration missing' do
      it 'is not found' do
        allow(Api::V3::Profiles::ChartConfiguration).to(
          receive(:new).and_return(chart_config)
        )
        allow(chart_config).to(
          receive(:named_node_types).with('source').and_return([])
        )

        get :top_sources, params: valid_params
        expect(response).to have_http_status(404)
      end
    end

    context 'when named attribute configuration missing' do
      it 'is not found' do
        allow(Api::V3::Profiles::ChartConfiguration).to(
          receive(:new).and_return(chart_config)
        )
        allow(chart_config).to(
          receive(:named_node_types).
            with('source').
            and_return([api_v3_department_node_type])
        )
        allow(chart_config).to(
          receive(:named_attribute).
            with('commodity_production').
            and_return(nil)
        )

        get :top_sources, params: valid_params
        expect(response).to have_http_status(404)
      end
    end
  end
end
