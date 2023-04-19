require "rails_helper"

RSpec.describe Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts do
  include_context "api v3 brazil context node types"
  include_context "api v3 brazil recolor by attributes"
  include_context "api v3 brazil resize by attributes"
  include_context "api v3 brazil soy nodes"

  before(:each) do
    Api::V3::Readonly::FlowQualDistinctValues.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
  end

  let(:cont_attribute) { api_v3_volume.readonly_attribute }
  let(:ncont_attribute) { api_v3_forest_500.readonly_attribute }
  let(:mandatory_parameters) {
    {
      country_id: api_v3_brazil_soy_context.country_id,
      commodity_id: api_v3_brazil_soy_context.commodity_id,
      cont_attribute_id: cont_attribute.id
    }
  }
  let(:no_flow_path_filters) {
    {
      sources_ids: [],
      companies_ids: [],
      exporters_ids: [],
      importers_ids: [],
      destinations_ids: [],
      excluded_sources_ids: [],
      excluded_companies_ids: [],
      excluded_exporters_ids: [],
      excluded_importers_ids: [],
      excluded_destinations_ids: []
    }
  }
  let(:single_year) { {start_year: 2017, end_year: 2017} }
  let(:multi_year) { {start_year: 2016, end_year: 2017} }

  let(:chart_types) {
    Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts.new(
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
      chart_type_with_applied_parameters(chart_type, parameters)
    end
  }

  context "when single year, no non-cont indicator, no flow-path filters" do
    let(:parameters) {
      mandatory_parameters.merge(single_year).merge(no_flow_path_filters).merge(
        ncont_attribute_id: nil
      )
    }
    let(:simplified_expected_chart_types) {
      [
        {
          source: :single_year_no_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::DYNAMIC_SENTENCE,
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
        api_v3_country_of_first_import_node_type
      ].map do |node_type|
        {
          source: :single_year_no_ncont_node_type_view,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::HORIZONTAL_BAR_CHART,
          x: :node_type,
          node_type_id: node_type.id
        }
      end
    }
    it "returns expected chart types" do
      expect(chart_types).to match_array(expected_chart_types)
    end
  end

  context "when multiple years, no non-cont indicator, no flow path filters" do
    let(:parameters) {
      mandatory_parameters.merge(multi_year).merge(no_flow_path_filters).merge(
        ncont_attribute_id: nil
      )
    }
    let(:simplified_expected_chart_types) {
      [
        {
          source: :multi_year_no_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::BAR_CHART,
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
        api_v3_country_of_first_import_node_type
      ].map do |node_type|
        {
          source: :multi_year_no_ncont_node_type_view,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :node_type,
          node_type_id: node_type.id
        }
      end
    }
    it "returns expected chart types" do
      expect(chart_types).to match_array(expected_chart_types)
    end
  end

  context "when single year, non-cont indicator, no flow path filters" do
    let(:parameters) {
      mandatory_parameters.merge(single_year).merge(no_flow_path_filters).merge(
        ncont_attribute_id: ncont_attribute.id
      )
    }
    let(:simplified_expected_chart_types) {
      [
        {
          source: :single_year_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::DONUT_CHART,
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
        api_v3_country_of_first_import_node_type
      ].map do |node_type|
        {
          source: :single_year_ncont_node_type_view,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::HORIZONTAL_STACKED_BAR_CHART,
          x: :node_type,
          break_by: :ncont_attribute,
          node_type_id: node_type.id
        }
      end
    }
    it "returns expected chart types" do
      expect(chart_types).to match_array(expected_chart_types)
    end
  end

  context "when multiple years, non-cont indicator, no flow path filters" do
    let(:parameters) {
      mandatory_parameters.merge(multi_year).merge(no_flow_path_filters).merge(
        ncont_attribute_id: ncont_attribute.id
      )
    }
    let(:simplified_expected_chart_types) {
      [
        {
          source: :multi_year_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
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
        api_v3_country_of_first_import_node_type
      ].map do |node_type|
        {
          source: :multi_year_no_ncont_node_type_view,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :node_type,
          node_type_id: node_type.id
        }
      end
    }

    it "returns expected chart types" do
      expect(chart_types).to match_array(expected_chart_types)
    end
  end

  # TODO: remove once dashboards_companies_mv retired
  context "when multiple years, non-cont indicator, 1 exporter" do
    let(:overview_parameters) {
      mandatory_parameters.merge(multi_year).merge(
        ncont_attribute_id: ncont_attribute.id
      )
    }
    let(:parameters) {
      overview_parameters.
        merge(no_flow_path_filters).
        merge(
          companies_ids: [
            api_v3_exporter1_node.id
          ]
        )
    }
    let(:simplified_expected_chart_types) {
      [
        {
          source: :multi_year_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :ncont_attribute
        },
        {
          source: :multi_year_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :ncont_attribute,
          node_type_id: api_v3_exporter_node_type.id,
          companies_ids: [api_v3_exporter1_node.id],
          single_filter_key: :companies,
          grouping_key: :cont_attribute_id,
          grouping_label: api_v3_exporter1_node.name
        }
      ] + [
        api_v3_biome_node_type,
        api_v3_state_node_type,
        api_v3_municipality_node_type,
        api_v3_logistics_hub_node_type,
        api_v3_port_node_type,
        api_v3_importer_node_type,
        api_v3_country_of_first_import_node_type
      ].map do |node_type|
        {
          source: :multi_year_no_ncont_node_type_view,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :node_type,
          node_type_id: node_type.id
        }
      end
    }

    it "returns expected chart types" do
      expect(chart_types).to match_array(expected_chart_types)
    end
  end

  context "when multiple years, non-cont indicator, 1 exporter" do
    let(:overview_parameters) {
      mandatory_parameters.merge(multi_year).merge(
        ncont_attribute_id: ncont_attribute.id
      )
    }
    let(:parameters) {
      overview_parameters.
        merge(no_flow_path_filters).
        merge(
          exporters_ids: [
            api_v3_exporter1_node.id
          ]
        )
    }
    let(:simplified_expected_chart_types) {
      [
        {
          source: :multi_year_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :ncont_attribute
        },
        {
          source: :multi_year_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :ncont_attribute,
          node_type_id: api_v3_exporter_node_type.id,
          exporters_ids: [api_v3_exporter1_node.id],
          single_filter_key: :exporters,
          grouping_key: :cont_attribute_id,
          grouping_label: api_v3_exporter1_node.name
        }
      ] + [
        api_v3_biome_node_type,
        api_v3_state_node_type,
        api_v3_municipality_node_type,
        api_v3_logistics_hub_node_type,
        api_v3_port_node_type,
        api_v3_importer_node_type,
        api_v3_country_of_first_import_node_type
      ].map do |node_type|
        {
          source: :multi_year_no_ncont_node_type_view,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :node_type,
          node_type_id: node_type.id
        }
      end
    }

    it "returns expected chart types" do
      expect(chart_types).to match_array(expected_chart_types)
    end
  end

  # TODO: remove once dashboards_companies_mv retired
  context "when multiple years, non-cont indicator, 1 exporter, 1 excluded source" do
    let(:overview_parameters) {
      mandatory_parameters.merge(multi_year).merge(
        ncont_attribute_id: ncont_attribute.id
      )
    }
    let(:parameters) {
      overview_parameters.
        merge(no_flow_path_filters).
        merge(
          companies_ids: [
            api_v3_exporter1_node.id
          ],
          excluded_sources_ids: [api_v3_municipality_node.id]
        )
    }
    let(:simplified_expected_chart_types) {
      [
        {
          source: :multi_year_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :ncont_attribute
        },
        {
          source: :multi_year_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :ncont_attribute,
          node_type_id: api_v3_exporter_node_type.id,
          companies_ids: [api_v3_exporter1_node.id],
          excluded_sources_ids: [api_v3_municipality_node.id],
          single_filter_key: :companies,
          grouping_key: :cont_attribute_id,
          grouping_label: api_v3_exporter1_node.name
        }
      ] + [
        api_v3_biome_node_type,
        api_v3_state_node_type,
        api_v3_municipality_node_type,
        api_v3_logistics_hub_node_type,
        api_v3_port_node_type,
        api_v3_importer_node_type,
        api_v3_country_of_first_import_node_type
      ].map do |node_type|
        {
          source: :multi_year_no_ncont_node_type_view,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :node_type,
          node_type_id: node_type.id
        }
      end
    }

    it "returns expected chart types" do
      expect(chart_types).to match_array(expected_chart_types)
    end
  end

  context "when multiple years, non-cont indicator, 1 exporter, 1 excluded source" do
    let(:overview_parameters) {
      mandatory_parameters.merge(multi_year).merge(
        ncont_attribute_id: ncont_attribute.id
      )
    }
    let(:parameters) {
      overview_parameters.
        merge(no_flow_path_filters).
        merge(
          exporters_ids: [
            api_v3_exporter1_node.id
          ],
          excluded_sources_ids: [api_v3_municipality_node.id]
        )
    }
    let(:simplified_expected_chart_types) {
      [
        {
          source: :multi_year_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :ncont_attribute
        },
        {
          source: :multi_year_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :ncont_attribute,
          node_type_id: api_v3_exporter_node_type.id,
          exporters_ids: [api_v3_exporter1_node.id],
          excluded_sources_ids: [api_v3_municipality_node.id],
          single_filter_key: :exporters,
          grouping_key: :cont_attribute_id,
          grouping_label: api_v3_exporter1_node.name
        }
      ] + [
        api_v3_biome_node_type,
        api_v3_state_node_type,
        api_v3_municipality_node_type,
        api_v3_logistics_hub_node_type,
        api_v3_port_node_type,
        api_v3_importer_node_type,
        api_v3_country_of_first_import_node_type
      ].map do |node_type|
        {
          source: :multi_year_no_ncont_node_type_view,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :node_type,
          node_type_id: node_type.id
        }
      end
    }

    it "returns expected chart types" do
      expect(chart_types).to match_array(expected_chart_types)
    end
  end

  # TODO: remove once dashboards_companies_mv retired
  context "when multiple years, non-cont indicator, 2 exporters" do
    let(:overview_parameters) {
      mandatory_parameters.merge(multi_year).merge(
        ncont_attribute_id: ncont_attribute.id
      )
    }
    let(:parameters) {
      overview_parameters.
        merge(no_flow_path_filters).
        merge(
          companies_ids: [
            api_v3_exporter1_node.id, api_v3_exporter2_node.id
          ]
        )
    }
    let(:simplified_expected_chart_types) {
      [
        {
          source: :multi_year_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :ncont_attribute
        },
        {
          source: :multi_year_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :ncont_attribute,
          node_type_id: api_v3_exporter_node_type.id,
          companies_ids: [api_v3_exporter1_node.id],
          single_filter_key: :companies,
          grouping_key: :cont_attribute_id,
          grouping_label: api_v3_exporter1_node.name
        },
        {
          source: :multi_year_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :ncont_attribute,
          node_type_id: api_v3_exporter_node_type.id,
          companies_ids: [api_v3_exporter2_node.id],
          single_filter_key: :companies,
          grouping_key: :cont_attribute_id,
          grouping_label: api_v3_exporter2_node.name
        }
      ] + [
        api_v3_biome_node_type,
        api_v3_state_node_type,
        api_v3_municipality_node_type,
        api_v3_logistics_hub_node_type,
        api_v3_port_node_type,
        api_v3_importer_node_type,
        api_v3_exporter_node_type,
        api_v3_country_of_first_import_node_type
      ].map do |node_type|
        {
          source: :multi_year_no_ncont_node_type_view,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :node_type,
          node_type_id: node_type.id
        }
      end
    }

    it "returns expected chart types" do
      expect(chart_types).to match_array(expected_chart_types)
    end
  end

  context "when multiple years, non-cont indicator, 2 exporters" do
    let(:overview_parameters) {
      mandatory_parameters.merge(multi_year).merge(
        ncont_attribute_id: ncont_attribute.id
      )
    }
    let(:parameters) {
      overview_parameters.
        merge(no_flow_path_filters).
        merge(
          exporters_ids: [
            api_v3_exporter1_node.id, api_v3_exporter2_node.id
          ]
        )
    }
    let(:simplified_expected_chart_types) {
      [
        {
          source: :multi_year_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :ncont_attribute
        },
        {
          source: :multi_year_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :ncont_attribute,
          node_type_id: api_v3_exporter_node_type.id,
          exporters_ids: [api_v3_exporter1_node.id],
          single_filter_key: :exporters,
          grouping_key: :cont_attribute_id,
          grouping_label: api_v3_exporter1_node.name
        },
        {
          source: :multi_year_ncont_overview,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :ncont_attribute,
          node_type_id: api_v3_exporter_node_type.id,
          exporters_ids: [api_v3_exporter2_node.id],
          single_filter_key: :exporters,
          grouping_key: :cont_attribute_id,
          grouping_label: api_v3_exporter2_node.name
        }
      ] + [
        api_v3_biome_node_type,
        api_v3_state_node_type,
        api_v3_municipality_node_type,
        api_v3_logistics_hub_node_type,
        api_v3_port_node_type,
        api_v3_importer_node_type,
        api_v3_exporter_node_type,
        api_v3_country_of_first_import_node_type
      ].map do |node_type|
        {
          source: :multi_year_no_ncont_node_type_view,
          type: Api::V3::Dashboards::ParametrisedCharts::FlowValuesCharts::STACKED_BAR_CHART,
          x: :year,
          break_by: :node_type,
          node_type_id: node_type.id
        }
      end
    }

    it "returns expected chart types" do
      expect(chart_types).to match_array(expected_chart_types)
    end
  end
end
