shared_context 'api v3 brazil importer actor profile' do
  include_context 'api v3 brazil context node types'
  include_context 'api v3 inds'
  include_context 'api v3 quants'

  let!(:api_v3_importer_sustainability) do
    chart = Api::V3::Chart.where(
      profile_id: api_v3_brazil_importer_actor_profile.id,
      identifier: :sustainability
    ).first
    chart || FactoryBot.create(
      :api_v3_chart,
      profile: api_v3_brazil_importer_actor_profile,
      identifier: :sustainability,
      title: 'Deforestation risk associated with top sourcing regions',
      position: 2
    )
  end

  let!(:api_v3_importer_sustainability_deforestation_v2) do
    chart_attribute = Api::V3::ChartQuant.
      includes(:chart_attribute).
      where(
        'chart_attributes.chart_id' => api_v3_importer_sustainability.id,
        quant_id: api_v3_deforestation_v2.id
      ).first&.chart_attribute
    unless chart_attribute
      chart_attribute = FactoryBot.create(
        :api_v3_chart_attribute,
        chart: api_v3_importer_sustainability,
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
end
