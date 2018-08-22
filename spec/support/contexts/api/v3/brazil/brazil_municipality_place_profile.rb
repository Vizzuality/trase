shared_context 'api v3 brazil municipality place profile' do
  include_context 'api v3 brazil context node types'
  include_context 'api v3 inds'
  include_context 'api v3 quants'

  let!(:api_v3_place_trajectory_deforestation) do
    chart = Api::V3::Chart.where(
      profile_id: api_v3_brazil_municipality_place_profile.id,
      identifier: :trajectory_deforestation
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_municipality_place_profile,
      identifier: :trajectory_deforestation,
      title: 'Deforestation trajectory',
      position: 1
    )
  end

  let!(:api_v3_place_indicators) do
    chart = Api::V3::Chart.where(
      profile_id: api_v3_brazil_municipality_place_profile.id,
      identifier: :indicators
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_municipality_place_profile,
      identifier: :indicators,
      title: 'Sustainability indicators',
      position: 0
    )
  end

  let!(:api_v3_place_environmental_indicators) do
    chart = Api::V3::Chart.where(
      profile_id: api_v3_brazil_municipality_place_profile.id,
      parent_id: api_v3_place_indicators.id,
      identifier: :environmental_indicators
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_municipality_place_profile,
      parent: api_v3_place_indicators,
      identifier: :environmental_indicators,
      title: 'Environmental indicators',
      position: 0
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
      identifier: :socioeconomic_indicators
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_municipality_place_profile,
      parent: api_v3_place_indicators,
      identifier: :socioeconomic_indicators,
      title: 'Socio-economic indicators',
      position: 1
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
      identifier: :agricultural_indicators
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_municipality_place_profile,
      parent: api_v3_place_indicators,
      identifier: :agricultural_indicators,
      title: 'Agricultural indicators',
      position: 2
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
      identifier: :territorial_governance
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_municipality_place_profile,
      parent: api_v3_place_indicators,
      identifier: :territorial_governance,
      title: 'Territorial governance',
      position: 3
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
end
