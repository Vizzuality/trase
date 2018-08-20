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
end
