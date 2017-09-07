shared_context "brazil soy indicators" do
  let(:brazil){
    FactoryGirl.create(:country, name: 'BRAZIL', iso2: 'BR')
  }
  let!(:context){
    context = FactoryGirl.create(
      :context,
      country: brazil,
      commodity: FactoryGirl.create(:commodity, name: 'SOY'),
      years: [2014, 2015],
      default_year: 2015
    )
    [forest_500, deforestation_v2, zero_deforestation].each_with_index do |indicator, idx|
      FactoryGirl.create(:context_indicator, context: context, indicator: indicator, position: idx)
    end
    context
  }
  let!(:another_context){
    context = FactoryGirl.create(
      :context,
      country: brazil,
      commodity: FactoryGirl.create(:commodity, name: 'BEEF')
    )
    FactoryGirl.create(:context_indicator, context: context, indicator: fob)
    context
  }
  let(:forest_500){
    FactoryGirl.create(:ind, name: 'FOREST_500')
  }
  let(:fob){
    FactoryGirl.create(:quant, name: 'FOB')
  }
  let(:deforestation_v2){
    FactoryGirl.create(:qual, name: 'DEFORESTATION_V2')
  }
  let(:zero_deforestation){
    FactoryGirl.create(:qual, name: 'ZERO_DEFORESTATION')
  }
end
