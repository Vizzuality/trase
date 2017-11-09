shared_context 'api v3 brazil contexts' do
  let!(:api_v3_brazil) do
    FactoryGirl.create(
      :api_v3_country,
      name: 'BRAZIL', iso2: 'BR', latitude: 10, longitude: 10, zoom: 4
    )
  end
  let!(:api_v3_context) do
    FactoryGirl.create(
      :api_v3_context,
      country: api_v3_brazil,
      commodity: FactoryGirl.create(:api_v3_commodity, name: 'SOY'),
      years: [2014, 2015],
      default_year: 2015
    )
  end
  let!(:api_v3_another_context) do
    FactoryGirl.create(
      :api_v3_context,
      country: api_v3_brazil,
      commodity: FactoryGirl.create(:api_v3_commodity, name: 'BEEF'),
      years: [2014, 2015],
      default_year: 2015
    )
  end
end
