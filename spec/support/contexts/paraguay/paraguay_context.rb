shared_context 'paraguay context' do
  let!(:paraguay_context) do
    FactoryBot.create(
      :context,
      country: FactoryBot.create(:country, name: 'PARAGUAY', iso2: 'PY'),
      commodity: FactoryBot.create(:commodity, name: 'SOY')
    )
  end
end
