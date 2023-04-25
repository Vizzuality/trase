require "rails_helper"

RSpec.describe Api::V3::Dashboards::ParametrisedCharts::NodeValuesCharts do
  include_context "api v3 brazil municipality quant values"
  include_context "api v3 brazil soy flows"

  before(:each) do
    Api::V3::Readonly::QuantValuesMeta.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
  end

  let(:force_labour_dashboards_attribute) {
    FactoryBot.create(:api_v3_dashboards_attribute)
  }

  let!(:force_labour_dashboards_quant) {
    FactoryBot.create(
      :api_v3_dashboards_quant,
      dashboards_attribute: force_labour_dashboards_attribute,
      quant: api_v3_force_labour
    )
  }

  let(:force_labour_attribute) { api_v3_force_labour.readonly_attribute }

  let(:mandatory_parameters) {
    {
      country_id: api_v3_brazil_soy_context.country_id,
      commodity_id: api_v3_brazil_soy_context.commodity_id
    }
  }

  let(:single_year) { {start_year: 2010, end_year: 2010} }
  let(:multi_year) { {start_year: 2010, end_year: 2011} }

  let(:chart_types) {
    Api::V3::Dashboards::ParametrisedCharts::NodeValuesCharts.new(
      Api::V3::Dashboards::ChartParameters::FlowValues.new(parameters)
    ).call
  }

  def chart_type_with_applied_parameters(chart_type, parameters)
    parameters.keys.each do |key|
      value = chart_type[key] || parameters[key]
      chart_type[key] =
        if value.is_a?(Array)
          value.join(",")
        else
          value
        end
    end
    chart_type
  end

  let(:expected_chart_types) {
    simplified_expected_chart_types.map do |chart_type|
      chart_type_with_applied_parameters(chart_type, chart_parameters)
    end
  }

  context "when single year" do
    let(:parameters) {
      mandatory_parameters.
        merge(single_year).
        merge(sources_ids: [api_v3_municipality_node.id])
    }
    let(:chart_parameters) {
      mandatory_parameters.
        merge(single_year).
        merge(
          cont_attribute_id: force_labour_attribute.id,
          node_id: api_v3_municipality_node.id,
          node_type_id: api_v3_municipality_node.node_type_id
        )
    }
    let(:simplified_expected_chart_types) {
      [
        {
          source: :single_year_node_values_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::NodeValuesCharts::DYNAMIC_SENTENCE,
          x: nil,
          grouping_key: :node_id,
          grouping_label: force_labour_attribute.display_name
        }
      ]
    }
    it "returns expected chart types" do
      expect(chart_types).to match_array(expected_chart_types)
    end
  end

  context "when multiple years" do
    let(:parameters) {
      mandatory_parameters.
        merge(multi_year).
        merge(sources_ids: [api_v3_municipality_node.id])
    }
    let(:chart_parameters) {
      mandatory_parameters.
        merge(multi_year).
        merge(
          cont_attribute_id: force_labour_attribute.id,
          node_id: api_v3_municipality_node.id,
          node_type_id: api_v3_municipality_node.node_type_id
        )
    }
    let(:simplified_expected_chart_types) {
      [
        {
          source: :multi_year_node_values_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::NodeValuesCharts::BAR_CHART,
          x: :year,
          grouping_key: :node_id,
          grouping_label: force_labour_attribute.display_name
        }
      ]
    }
    it "returns expected chart types" do
      expect(chart_types).to match_array(expected_chart_types)
    end
  end
end
