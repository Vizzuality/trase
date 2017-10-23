shared_context 'paraguay context' do
  let!(:paraguay_context){
    FactoryGirl.create(
      :context,
      country: FactoryGirl.create(:country, name: 'PARAGUAY', iso2: 'PY'),
      commodity: FactoryGirl.create(:commodity, name: 'SOY')
    )
  }
end