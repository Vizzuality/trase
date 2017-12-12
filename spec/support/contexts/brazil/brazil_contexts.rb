shared_context 'brazil contexts' do
  let!(:brazil) do
    Country.find_by_iso2('BR') ||
      FactoryBot.create(:country, name: 'BRAZIL', iso2: 'BR', latitude: 10, longitude: 10, zoom: 4)
  end
  let!(:soy) do
    Commodity.find_by_name('SOY') ||
      FactoryBot.create(:commodity, name: 'SOY')
  end
  let!(:beef) do
    Commodity.find_by_name('BEEF') ||
      FactoryBot.create(:commodity, name: 'BEEF')
  end
  let!(:context) do
    Context.where(country_id: brazil.id, commodity_id: soy.id).first ||
      FactoryBot.create(
        :context,
        country: brazil,
        commodity: soy,
        years: [2014, 2015],
        default_year: 2015
      )
  end
  let!(:another_context) do
    Context.where(country_id: brazil.id, commodity_id: beef.id).first ||
      FactoryBot.create(
        :context,
        country: brazil,
        commodity: beef,
        years: [2014, 2015],
        default_year: 2015
      )
  end
end
