shared_context 'api v3 brazil municipality place profile' do
  include_context 'api v3 brazil soy profiles'
  include_context 'api v3 inds'
  include_context 'api v3 quants'

  let!(:api_v3_place_basic_attributes) do
    chart = Api::V3::Chart.where(
      profile_id: api_v3_brazil_municipality_place_profile.id,
      identifier: :place_basic_attributes
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_municipality_place_profile,
      identifier: :place_basic_attributes,
      position: 0,
      title: 'Basic attributes'
    )
  end

  let!(:api_v3_place_basic_attributes_area) do
    chart_attribute = Api::V3::ChartQuant.
      includes(:chart_attribute).
      where(
        'chart_attributes.chart_id' => api_v3_place_basic_attributes.id,
        quant_id: api_v3_area.id
      ).first&.chart_attribute
    unless chart_attribute
      chart_attribute = FactoryBot.create(
        :api_v3_chart_attribute,
        chart: api_v3_place_basic_attributes,
        identifier: 'area',
        position: nil
      )
      FactoryBot.create(
        :api_v3_chart_quant,
        chart_attribute: chart_attribute,
        quant: api_v3_area
      )
    end
    chart_attribute
  end

  let!(:api_v3_place_basic_attributes_area_property) do
    quant_context_property = Api::V3::QuantContextProperty.
      where(
        context_id: api_v3_context.id,
        quant_id: api_v3_area.id
      ).first
    unless quant_context_property
      quant_context_property = FactoryBot.create(
        :api_v3_quant_context_property,
        context: api_v3_context,
        quant: api_v3_area,
        tooltip_text: 'Tooltip context quant translation'
      )
    end
    quant_context_property
  end

  let!(:api_v3_place_basic_attributes_commodity_area) do
    chart_attribute = Api::V3::ChartInd.
      includes(:chart_attribute).
      where(
        'chart_attributes.chart_id' => api_v3_place_basic_attributes.id,
        ind_id: api_v3_soy_areaperc.id
      ).first&.chart_attribute
    unless chart_attribute
      chart_attribute = FactoryBot.create(
        :api_v3_chart_attribute,
        chart: api_v3_place_basic_attributes,
        identifier: 'commodity_farmland',
        position: nil
      )
      FactoryBot.create(
        :api_v3_chart_ind,
        chart_attribute: chart_attribute,
        ind: api_v3_soy_areaperc
      )
    end
    chart_attribute
  end

  let!(:api_v3_place_basic_attributes_commodity_production) do
    chart_attribute = Api::V3::ChartQuant.
      includes(:chart_attribute).
      where(
        'chart_attributes.chart_id' => api_v3_place_basic_attributes.id,
        quant_id: api_v3_soy_tn.id
      ).first&.chart_attribute
    unless chart_attribute
      chart_attribute = FactoryBot.create(
        :api_v3_chart_attribute,
        chart: api_v3_place_basic_attributes,
        identifier: 'commodity_production',
        position: nil
      )
      FactoryBot.create(
        :api_v3_chart_quant,
        chart_attribute: chart_attribute,
        quant: api_v3_soy_tn
      )
    end
    chart_attribute
  end

  let!(:api_v3_place_basic_attributes_commodity_production_property) do
    quant_context_property = Api::V3::QuantContextProperty.
      where(
        context_id: api_v3_context.id,
        quant_id: api_v3_soy_tn.id
      ).first
    unless quant_context_property
      quant_context_property = FactoryBot.create(
        :api_v3_quant_context_property,
        context: api_v3_context,
        quant: api_v3_soy_tn,
        tooltip_text: 'Tooltip context quant translation'
      )
    end
    quant_context_property
  end

  let!(:api_v3_place_basic_attributes_commodity_yield) do
    chart_attribute = Api::V3::ChartInd.
      includes(:chart_attribute).
      where(
        'chart_attributes.chart_id' => api_v3_place_basic_attributes.id,
        ind_id: api_v3_soy_yield.id
      ).first&.chart_attribute
    unless chart_attribute
      chart_attribute = FactoryBot.create(
        :api_v3_chart_attribute,
        chart: api_v3_place_basic_attributes,
        identifier: 'commodity_yield',
        position: nil
      )
      FactoryBot.create(
        :api_v3_chart_ind,
        chart_attribute: chart_attribute,
        ind: api_v3_soy_yield
      )
    end
    chart_attribute
  end

  let!(:api_v3_place_basic_attributes_summary_node_types) do
    [
      api_v3_municipality_node_type,
      api_v3_logistics_hub_node_type
    ].each.with_index do |node_type, idx|
      chart_node_type = Api::V3::ChartNodeType.where(
        chart_id: api_v3_place_basic_attributes.id,
        node_type_id: node_type.id,
        identifier: 'summary'
      ).first
      chart_node_type || FactoryBot.create(
        :api_v3_chart_node_type,
        chart: api_v3_place_basic_attributes,
        node_type: node_type,
        identifier: 'summary',
        position: idx
      )
    end
  end

  let!(:api_v3_place_indicators) do
    chart = Api::V3::Chart.where(
      profile_id: api_v3_brazil_municipality_place_profile.id,
      identifier: :place_indicators
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_municipality_place_profile,
      identifier: :place_indicators,
      position: 1,
      title: 'Sustainability indicators'
    )
  end

  let!(:api_v3_place_environmental_indicators) do
    chart = Api::V3::Chart.where(
      profile_id: api_v3_brazil_municipality_place_profile.id,
      parent_id: api_v3_place_indicators.id,
      identifier: :place_environmental_indicators
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_municipality_place_profile,
      parent: api_v3_place_indicators,
      identifier: :place_environmental_indicators,
      position: 0,
      title: 'Environmental indicators'
    )
  end

  let!(:api_v3_place_environmental_indicators_deforestation_v2) do
    chart_attribute = Api::V3::ChartQuant.
      includes(:chart_attribute).
      where(
        'chart_attributes.chart_id' => api_v3_place_environmental_indicators.id,
        quant_id: api_v3_deforestation_v2.id
      ).first&.chart_attribute
    unless chart_attribute
      chart_attribute = FactoryBot.create(
        :api_v3_chart_attribute,
        chart: api_v3_place_environmental_indicators,
        identifier: nil,
        position: 0
      )
      FactoryBot.create(
        :api_v3_chart_quant,
        chart_attribute: chart_attribute,
        quant: api_v3_deforestation_v2
      )
    end
    chart_attribute
  end

  let!(:api_v3_place_socioeconomic_indicators) do
    chart = Api::V3::Chart.where(
      profile_id: api_v3_brazil_municipality_place_profile.id,
      parent_id: api_v3_place_indicators.id,
      identifier: :place_socioeconomic_indicators
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_municipality_place_profile,
      parent: api_v3_place_indicators,
      identifier: :place_socioeconomic_indicators,
      position: 1,
      title: 'Socio-economic indicators'
    )
  end

  let!(:api_v3_place_socioeconomic_indicators_human_development_index) do
    chart_attribute = Api::V3::ChartInd.
      includes(:chart_attribute).
      where(
        'chart_attributes.chart_id' => api_v3_place_socioeconomic_indicators.id,
        ind_id: api_v3_human_development_index.id
      ).first&.chart_attribute
    unless chart_attribute
      chart_attribute = FactoryBot.create(
        :api_v3_chart_attribute,
        chart: api_v3_place_socioeconomic_indicators,
        identifier: nil,
        position: 0
      )
      FactoryBot.create(
        :api_v3_chart_ind,
        chart_attribute: chart_attribute,
        ind: api_v3_human_development_index
      )
    end
    chart_attribute
  end

  let!(:api_v3_place_agricultural_indicators) do
    chart = Api::V3::Chart.where(
      profile_id: api_v3_brazil_municipality_place_profile.id,
      parent_id: api_v3_place_indicators.id,
      identifier: :place_agricultural_indicators
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_municipality_place_profile,
      parent: api_v3_place_indicators,
      identifier: :place_agricultural_indicators,
      position: 2,
      title: 'Agricultural indicators'
    )
  end

  let!(:api_v3_place_agricultural_indicators_soy_tn) do
    chart_attribute = Api::V3::ChartQuant.
      includes(:chart_attribute).
      where(
        'chart_attributes.chart_id' => api_v3_place_agricultural_indicators.id,
        quant_id: api_v3_soy_tn.id
      ).first&.chart_attribute
    unless chart_attribute
      chart_attribute = FactoryBot.create(
        :api_v3_chart_attribute,
        chart: api_v3_place_agricultural_indicators,
        identifier: nil,
        position: 0
      )
      FactoryBot.create(
        :api_v3_chart_quant,
        chart_attribute: chart_attribute,
        quant: api_v3_soy_tn
      )
    end
    chart_attribute
  end

  let!(:api_v3_place_territorial_governance) do
    chart = Api::V3::Chart.where(
      profile_id: api_v3_brazil_municipality_place_profile.id,
      parent_id: api_v3_place_indicators.id,
      identifier: :place_territorial_governance
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_municipality_place_profile,
      parent: api_v3_place_indicators,
      identifier: :place_territorial_governance,
      position: 3,
      title: 'Territorial governance'
    )
  end

  let!(:api_v3_place_territorial_governance_embargoes) do
    chart_attribute = Api::V3::ChartQuant.
      includes(:chart_attribute).
      where(
        'chart_attributes.chart_id' => api_v3_place_territorial_governance.id,
        quant_id: api_v3_embargoes.id
      ).first&.chart_attribute
    unless chart_attribute
      chart_attribute = FactoryBot.create(
        :api_v3_chart_attribute,
        chart: api_v3_place_territorial_governance,
        identifier: nil,
        position: 0
      )
      FactoryBot.create(
        :api_v3_chart_quant,
        chart_attribute: chart_attribute,
        quant: api_v3_embargoes
      )
    end
    chart_attribute
  end

  let!(:api_v3_place_trajectory_deforestation) do
    chart = Api::V3::Chart.where(
      profile_id: api_v3_brazil_municipality_place_profile.id,
      identifier: :place_trajectory_deforestation
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_municipality_place_profile,
      identifier: :place_trajectory_deforestation,
      position: 2,
      title: 'Deforestation trajectory'
    )
  end

  let!(:api_v3_place_trajectory_deforestation_deforestation_v2) do
    chart_attribute = Api::V3::ChartQuant.
      includes(:chart_attribute).
      where(
        'chart_attributes.chart_id' => api_v3_place_trajectory_deforestation.id,
        quant_id: api_v3_deforestation_v2.id
      ).first&.chart_attribute
    unless chart_attribute
      chart_attribute = FactoryBot.create(
        :api_v3_chart_attribute,
        chart: api_v3_place_trajectory_deforestation,
        display_name: 'Territorial Deforestation',
        legend_name: 'Territorial<br/>Deforestation',
        display_type: 'area',
        display_style: 'area-black',
        identifier: nil,
        position: 0
      )
      FactoryBot.create(
        :api_v3_chart_quant,
        chart_attribute: chart_attribute,
        quant: api_v3_deforestation_v2
      )
    end
    chart_attribute
  end

  let!(:api_v3_place_top_consumer_actors) do
    chart = Api::V3::Chart.where(
      profile_id: api_v3_brazil_municipality_place_profile.id,
      identifier: :place_top_consumer_actors
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_municipality_place_profile,
      identifier: :place_top_consumer_actors,
      position: 3,
      title: 'Top traders'
    )
  end

  let!(:api_v3_place_top_consumer_actors_trader_node_type) do
    chart_node_type = Api::V3::ChartNodeType.where(
      chart_id: api_v3_place_top_consumer_actors.id,
      node_type_id: api_v3_exporter_node_type.id,
      identifier: 'trader'
    ).first
    chart_node_type || FactoryBot.create(
      :api_v3_chart_node_type,
      chart: api_v3_place_top_consumer_actors,
      node_type: api_v3_exporter_node_type,
      identifier: 'trader'
    )
  end

  let!(:api_v3_place_top_consumer_countries) do
    chart = Api::V3::Chart.where(
      profile_id: api_v3_brazil_municipality_place_profile.id,
      identifier: :place_top_consumer_countries
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_municipality_place_profile,
      identifier: :place_top_consumer_countries,
      position: 4,
      title: 'Top importer countries'
    )
  end

  let!(:api_v3_place_top_consumer_countries_destination_node_type) do
    chart_node_type = Api::V3::ChartNodeType.where(
      chart_id: api_v3_place_top_consumer_countries.id,
      node_type_id: api_v3_country_node_type.id,
      identifier: 'destination'
    ).first
    chart_node_type || FactoryBot.create(
      :api_v3_chart_node_type,
      chart: api_v3_place_top_consumer_countries,
      node_type: api_v3_country_node_type,
      identifier: 'destination'
    )
  end
end
