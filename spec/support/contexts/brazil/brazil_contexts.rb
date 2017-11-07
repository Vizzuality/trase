shared_context 'brazil contexts' do
  let!(:brazil) do
    Country.find_by_iso2('BR') ||
    FactoryGirl.create(:country, name: 'BRAZIL', iso2: 'BR', latitude: 10, longitude: 10, zoom: 4)
  end
  let!(:context) do
    FactoryGirl.create(
      :context,
      country: brazil,
      commodity: FactoryGirl.create(:commodity, name: 'SOY'),
      years: [2014, 2015],
      default_year: 2015
    )
  end
  let!(:another_context) do
    FactoryGirl.create(
      :context,
      country: brazil,
      commodity: FactoryGirl.create(:commodity, name: 'BEEF'),
      years: [2014, 2015],
      default_year: 2015
    )
  end
end
