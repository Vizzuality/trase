shared_context 'paraguay context' do
  let!(:paraguay) do
    Country.find_by_iso2('PY') ||
      FactoryBot.create(:country, name: 'PARAGUAY', iso2: 'PY', latitude: -23.44, longitude: '-58.44', zoom: 5)
  end
  let!(:soy) do
    Commodity.find_by_name('SOY') ||
      FactoryBot.create(:commodity, name: 'SOY')
  end
  let!(:paraguay_context) do
    Context.where(country_id: paraguay.id, commodity_id: soy.id).first ||
      FactoryBot.create(
        :context,
        country: paraguay,
        commodity: soy
      )
  end
end
