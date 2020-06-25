shared_context 'api v3 brazil exporter actor profile' do
  include_context 'api v3 brazil soy profiles'
  include_context 'api v3 inds'
  include_context 'api v3 quants'

  let!(:api_v3_exporter_basic_attributes) do
    chart = Api::V3::Chart.where(
      profile_id: api_v3_brazil_exporter_actor_profile.id,
      identifier: :actor_basic_attributes
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_exporter_actor_profile,
      identifier: :actor_basic_attributes,
      position: 0,
      title: 'Basic attributes'
    )
  end

  let!(:api_v3_exporter_basic_attributes_source_node_type) do
    chart_node_type = Api::V3::ChartNodeType.where(
      chart_id: api_v3_exporter_basic_attributes.id,
      node_type_id: api_v3_municipality_node_type.id,
      identifier: 'source'
    ).first
    chart_node_type || FactoryBot.create(
      :api_v3_chart_node_type,
      chart: api_v3_exporter_basic_attributes,
      node_type: api_v3_municipality_node_type,
      identifier: 'source'
    )
  end

  let!(:api_v3_exporter_basic_attributes_destination_node_type) do
    chart_node_type = Api::V3::ChartNodeType.where(
      chart_id: api_v3_exporter_basic_attributes.id,
      node_type_id: api_v3_country_node_type.id,
      identifier: 'destination'
    ).first
    chart_node_type || FactoryBot.create(
      :api_v3_chart_node_type,
      chart: api_v3_exporter_basic_attributes,
      node_type: api_v3_country_node_type,
      identifier: 'destination'
    )
  end

  let!(:api_v3_exporter_basic_attributes_zero_deforestation) do
    return unless defined?(api_v3_zero_deforestation)

    chart_attribute = Api::V3::ChartQual.
      includes(:chart_attribute).
      where(
        'chart_attributes.chart_id' => api_v3_exporter_basic_attributes.id,
        qual_id: api_v3_zero_deforestation.id
      ).first&.chart_attribute
    unless chart_attribute
      chart_attribute = FactoryBot.create(
        :api_v3_chart_attribute,
        chart: api_v3_exporter_basic_attributes,
        identifier: 'zero_deforestation'
      )
      FactoryBot.create(
        :api_v3_chart_qual,
        chart_attribute: chart_attribute,
        qual: api_v3_zero_deforestation
      )
    end
    chart_attribute
  end

  let!(:api_v3_exporter_basic_attributes_zero_deforestation_property) do
    return unless defined?(api_v3_zero_deforestation)

    qual_context_property = Api::V3::QualContextProperty.
      where(
        context_id: api_v3_context.id,
        qual_id: api_v3_zero_deforestation.id
      ).first
    unless qual_context_property
      qual_context_property = FactoryBot.create(
        :api_v3_qual_context_property,
        context: api_v3_context,
        qual: api_v3_zero_deforestation,
        tooltip_text: 'Tooltip context qual translation'
      )
    end
    qual_context_property
  end

  let!(:api_v3_exporter_basic_attributes_forest_500) do
    return unless defined?(api_v3_forest_500)

    chart_attribute = Api::V3::ChartInd.
      includes(:chart_attribute).
      where(
        'chart_attributes.chart_id' => api_v3_exporter_basic_attributes.id,
        ind_id: api_v3_forest_500.id
      ).first&.chart_attribute
    unless chart_attribute
      chart_attribute = FactoryBot.create(
        :api_v3_chart_attribute,
        chart: api_v3_exporter_basic_attributes,
        identifier: 'forest_500'
      )
      FactoryBot.create(
        :api_v3_chart_ind,
        chart_attribute: chart_attribute,
        ind: api_v3_forest_500
      )
    end
    chart_attribute
  end

  let!(:api_v3_exporter_basic_attributes_forest_500_property) do
    return unless defined?(api_v3_forest_500)

    ind_context_property = Api::V3::IndContextProperty.
      where(
        context_id: api_v3_context.id,
        ind_id: api_v3_forest_500.id
      ).first
    unless ind_context_property
      ind_context_property = FactoryBot.create(
        :api_v3_ind_context_property,
        context: api_v3_context,
        ind: api_v3_forest_500,
        tooltip_text: 'Tooltip context ind translation'
      )
    end
    ind_context_property
  end

  let!(:api_v3_exporter_top_countries) do
    chart = Api::V3::Chart.where(
      profile_id: api_v3_brazil_exporter_actor_profile.id,
      identifier: :actor_top_countries
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_exporter_actor_profile,
      identifier: :actor_top_countries,
      position: 1,
      title: 'Top destinations'
    )
  end

  let!(:api_v3_exporter_top_countries_commodity_production) do
    chart_attribute = Api::V3::ChartQuant.
      includes(:chart_attribute).
      where(
        'chart_attributes.chart_id' => api_v3_exporter_top_countries.id,
        quant_id: api_v3_soy_tn.id
      ).first&.chart_attribute
    unless chart_attribute
      chart_attribute = FactoryBot.create(
        :api_v3_chart_attribute,
        chart: api_v3_exporter_top_countries,
        identifier: 'commodity_production'
      )
      FactoryBot.create(
        :api_v3_chart_quant,
        chart_attribute: chart_attribute,
        quant: api_v3_soy_tn
      )
    end
    chart_attribute
  end

  let!(:api_v3_exporter_top_countries_destination_node_type) do
    chart_node_type = Api::V3::ChartNodeType.where(
      chart_id: api_v3_exporter_top_countries.id,
      node_type_id: api_v3_country_node_type.id,
      identifier: 'destination'
    ).first
    chart_node_type || FactoryBot.create(
      :api_v3_chart_node_type,
      chart: api_v3_exporter_top_countries,
      node_type: api_v3_country_node_type,
      identifier: 'destination'
    )
  end

  let!(:api_v3_exporter_top_sources) do
    chart = Api::V3::Chart.where(
      profile_id: api_v3_brazil_exporter_actor_profile.id,
      identifier: :actor_top_sources
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_exporter_actor_profile,
      identifier: :actor_top_sources,
      position: 2,
      title: 'Top sourcing regions'
    )
  end

  let!(:api_v3_exporter_top_sources_commodity_production) do
    chart_attribute = Api::V3::ChartQuant.
      includes(:chart_attribute).
      where(
        'chart_attributes.chart_id' => api_v3_exporter_top_sources.id,
        quant_id: api_v3_soy_tn.id
      ).first&.chart_attribute
    unless chart_attribute
      chart_attribute = FactoryBot.create(
        :api_v3_chart_attribute,
        chart: api_v3_exporter_top_sources,
        identifier: 'commodity_production'
      )
      FactoryBot.create(
        :api_v3_chart_quant,
        chart_attribute: chart_attribute,
        quant: api_v3_soy_tn
      )
    end
    chart_attribute
  end

  let!(:api_v3_exporter_top_sources_source_node_types) do
    [
      api_v3_biome_node_type,
      api_v3_state_node_type,
      api_v3_municipality_node_type
    ].each.with_index do |node_type, idx|
      chart_node_type = Api::V3::ChartNodeType.where(
        chart_id: api_v3_exporter_top_sources.id,
        node_type_id: node_type.id,
        identifier: 'source'
      ).first
      chart_node_type || FactoryBot.create(
        :api_v3_chart_node_type,
        chart: api_v3_exporter_top_sources,
        node_type: node_type,
        identifier: 'source',
        position: idx
      )
    end
  end

  let!(:api_v3_exporter_sustainability) do
    chart = Api::V3::Chart.where(
      profile_id: api_v3_brazil_exporter_actor_profile.id,
      identifier: :actor_sustainability
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_exporter_actor_profile,
      identifier: :actor_sustainability,
      position: 3,
      title: 'Deforestation risk associated with top sourcing regions'
    )
  end

  let!(:api_v3_exporter_sustainability_deforestation_v2) do
    chart_attribute = Api::V3::ChartQuant.
      includes(:chart_attribute).
      where(
        'chart_attributes.chart_id' => api_v3_exporter_sustainability.id,
        quant_id: api_v3_deforestation_v2.id
      ).first&.chart_attribute
    unless chart_attribute
      chart_attribute = FactoryBot.create(
        :api_v3_chart_attribute,
        chart: api_v3_exporter_sustainability,
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

  let!(:api_v3_exporter_sustainability_source_node_types) do
    [
      api_v3_biome_node_type,
      api_v3_municipality_node_type
    ].each.with_index do |node_type, idx|
      chart_node_type = Api::V3::ChartNodeType.where(
        chart_id: api_v3_exporter_sustainability.id,
        node_type_id: node_type.id,
        identifier: 'source'
      ).first
      chart_node_type || FactoryBot.create(
        :api_v3_chart_node_type,
        chart: api_v3_exporter_sustainability,
        node_type: node_type,
        identifier: 'source',
        position: idx
      )
    end
  end

  let!(:api_v3_exporter_exporting_companies) do
    chart = Api::V3::Chart.where(
      profile_id: api_v3_brazil_exporter_actor_profile.id,
      identifier: :actor_exporting_companies
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_exporter_actor_profile,
      identifier: :actor_exporting_companies,
      position: 4,
      title: 'Comparing companies'
    )
  end

  let!(:api_v3_exporter_exporting_companies_land_use) do
    chart_attribute = Api::V3::ChartQuant.
      includes(:chart_attribute).
      where(
        'chart_attributes.chart_id' => api_v3_exporter_exporting_companies.id,
        quant_id: api_v3_land_use.id
      ).first&.chart_attribute
    unless chart_attribute
      chart_attribute = FactoryBot.create(
        :api_v3_chart_attribute,
        chart: api_v3_exporter_exporting_companies,
        position: 0
      )
      FactoryBot.create(
        :api_v3_chart_quant,
        chart_attribute: chart_attribute,
        quant: api_v3_land_use
      )
    end
    chart_attribute
  end
end
