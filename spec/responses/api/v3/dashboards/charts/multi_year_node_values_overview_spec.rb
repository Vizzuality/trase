require 'rails_helper'
require 'responses/api/v3/dashboards/charts/required_chart_parameters_examples.rb'

RSpec.describe 'Charts::MultiYearNodeValuesOverview', type: :request do
  include_context 'api v3 brazil municipality quant values'
  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil soy profiles'

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::QuantValuesMeta.refresh(sync: true, skip_dependents: true)
  end

  let(:cont_attribute) { api_v3_force_labour.readonly_attribute }

  describe 'GET /api/v3/dashboards/charts/multi_year_node_values_overview' do
    let(:url) { '/api/v3/dashboards/charts/multi_year_node_values_overview' }
    let(:filter_params) {
      {
        country_id: api_v3_brazil.id,
        commodity_id: api_v3_soy.id,
        cont_attribute_id: cont_attribute.id,
        node_id: api_v3_municipality_node.id,
        start_year: 2015,
        end_year: 2016
      }
    }
    include_examples 'required node values chart parameters'

    it 'has the correct response structure' do
      get url, params: filter_params

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('dashboards_charts_multi_year_node_values_overview')
    end
  end
end
