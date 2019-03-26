require 'rails_helper'

RSpec.describe Api::V3::Dashboards::ParametrisedCharts do
  include_context 'api v3 brazil context node types'
  include_context 'api v3 brazil recolor by attributes'
  include_context 'api v3 brazil resize by attributes'

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::ResizeByAttribute.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::RecolorByAttribute.refresh(sync: true, skip_dependents: true)
  end

  let(:cont_attribute) { api_v3_volume.readonly_attribute }
  let(:ncont_attribute) { api_v3_forest_500.readonly_attribute }
  let(:mandatory_parameters) {
    {
      country_id: api_v3_context.country_id,
      commodity_id: api_v3_context.commodity_id,
      cont_attribute_id: cont_attribute.id
    }
  }
  let(:no_flow_path_filters) {
    {
      sources_ids: [],
      companies_ids: [],
      destinations_ids: []
    }
  }
  let(:single_year) { {start_year: 2017, end_year: 2017} }
  let(:multi_year) { {start_year: 2016, end_year: 2017} }

  let(:chart_types) {
    Api::V3::Dashboards::ParametrisedCharts.new(
      Api::V3::Dashboards::ChartParameters.new(parameters)
    ).call
  }

  let(:expected_chart_types) {
    simplified_expected_chart_types.map do |chart_type|
      chart_type.merge(parameters)
    end
  }

  context 'when single year, no non-cont indicator, no flow-path filters' do
    let(:parameters) {
      mandatory_parameters.merge(single_year).merge(no_flow_path_filters).merge(
        ncont_attribute_id: nil
      )
    }
    let(:simplified_expected_chart_types) {
      [
        {
          source: :single_year_no_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::DYNAMIC_SENTENCE,
          x: nil
        }
      ] + [
        api_v3_biome_node_type,
        api_v3_state_node_type,
        api_v3_municipality_node_type,
        api_v3_logistics_hub_node_type,
        api_v3_port_node_type,
        api_v3_exporter_node_type,
        api_v3_importer_node_type,
        api_v3_country_node_type
      ].map do |node_type|
        {
          source: :single_year_no_ncont_node_type_view,
          type: Api::V3::Dashboards::ParametrisedCharts::HORIZONTAL_BAR_CHART,
          x: :node_type,
          node_type_id: node_type.id
        }
      end
    }
    it 'returns expected chart types' do
      expect(chart_types).to eq(expected_chart_types)
    end
  end

  context 'when multiple years, no non-cont indicator, no flow path filters' do
    let(:parameters) {
      mandatory_parameters.merge(multi_year).merge(no_flow_path_filters).merge(
        ncont_attribute_id: nil
      )
    }
    let(:simplified_expected_chart_types) {
      [
        {
          source: :multi_year_no_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::BAR_CHART,
          x: :year
        }
      ] + [
        api_v3_biome_node_type,
        api_v3_state_node_type,
        api_v3_municipality_node_type,
        api_v3_logistics_hub_node_type,
        api_v3_port_node_type,
        api_v3_exporter_node_type,
        api_v3_importer_node_type,
        api_v3_country_node_type
      ].map do |node_type|
        {
          source: :multi_year_no_ncont_node_type_view,
          type: Api::V3::Dashboards::ParametrisedCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :node_type,
          node_type_id: node_type.id
        }
      end
    }
    it 'returns expected chart types' do
      expect(chart_types).to eq(expected_chart_types)
    end
  end

  context 'when single year, non-cont indicator, no flow path filters' do
    let(:parameters) {
      mandatory_parameters.merge(single_year).merge(no_flow_path_filters).merge(
        ncont_attribute_id: ncont_attribute.id
      )
    }
    let(:simplified_expected_chart_types) {
      [
        {
          source: :single_year_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::DONUT_CHART,
          x: :ncont_attribute
        }
      ] + [
        api_v3_biome_node_type,
        api_v3_state_node_type,
        api_v3_municipality_node_type,
        api_v3_logistics_hub_node_type,
        api_v3_port_node_type,
        api_v3_exporter_node_type,
        api_v3_importer_node_type,
        api_v3_country_node_type
      ].map do |node_type|
        {
          source: :single_year_ncont_node_type_view,
          type: Api::V3::Dashboards::ParametrisedCharts::HORIZONTAL_STACKED_BAR_CHART,
          x: :node_type,
          break_by: :ncont_attribute,
          node_type_id: node_type.id
        }
      end
    }
    it 'returns expected chart types' do
      expect(chart_types).to eq(expected_chart_types)
    end
  end

  context 'when multiple years, non-cont indicator, no flow path filters' do
    let(:parameters) {
      mandatory_parameters.merge(multi_year).merge(no_flow_path_filters).merge(
        ncont_attribute_id: ncont_attribute.id
      )
    }
    let(:simplified_expected_chart_types) {
      [
        {
          source: :multi_year_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :ncont_attribute
        }
      ] + [
        api_v3_biome_node_type,
        api_v3_state_node_type,
        api_v3_municipality_node_type,
        api_v3_logistics_hub_node_type,
        api_v3_port_node_type,
        api_v3_exporter_node_type,
        api_v3_importer_node_type,
        api_v3_country_node_type
      ].map do |node_type|
        {
          source: :multi_year_ncont_node_type_view,
          type: Api::V3::Dashboards::ParametrisedCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :ncont_attribute,
          filter_by: :node_type,
          node_type_id: node_type.id
        }
      end
    }
    it 'returns expected chart types' do
      expect(chart_types).to eq(expected_chart_types)
    end
  end
end
