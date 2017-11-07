shared_context 'quants' do
  let(:area) do
    Quant.find_by_name('AREA_KM2') ||
    FactoryGirl.create(:quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'AREA_KM2', unit: 'km2', unit_type: 'area', tooltip_text: 'Municipal area according in Km2', frontend_name: 'Area')
  end
  let(:land_conflicts) do
    Quant.find_by_name('LAND_CONFL') ||
    FactoryGirl.create(:quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'LAND_CONFL', unit: 'Number', unit_type: 'count', tooltip_text: 'Number of land conflicts per municipality', frontend_name: 'Land conflicts (2014)')
  end
  let(:force_labour) do
    Quant.find_by_name('SLAVERY') ||
    FactoryGirl.create(:quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'SLAVERY', unit: 'Number', unit_type: 'count', tooltip_text: 'Number of people involved in lawsuits relating to cases fo forced labor or degrading working conditions', frontend_name: 'Reported cases of forced labour (2014)')
  end
  let(:embargoes) do
    Quant.find_by_name('EMBARGOES_') ||
    FactoryGirl.create(:quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'EMBARGOES_', unit: 'Number', unit_type: 'count', tooltip_text: 'Number of fines and embargos associated with infringements of environmental legislations per municipality', frontend_name: 'Number of environmental embargos (2015)')
  end
  let(:fob) do
    Quant.find_by_name('FOB') ||
    FactoryGirl.create(:quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'FOB', unit: 'USD', tooltip_text: 'Value of commodity shipments', frontend_name: 'Financial flow')
  end
  let(:deforestation_v2) do
    Quant.find_by_name('DEFORESTATION_V2') ||
    FactoryGirl.create(:quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: true, name: 'DEFORESTATION_V2', unit: 'Ha', tooltip_text: 'Total deforestation per municipality for a given year (ha). Calculated only for forested and wooded biomes - the Amazon, Cerrado and Atlantic Forest. Clearance of native vegetation in Brazil´s other biomes (Caatinga, Pantanal and Pampas) is not considered as deforestation in this indicator.', frontend_name: 'Territorial deforestation')
  end
  let(:population) do
    Quant.find_by_name('POPULATION') ||
    FactoryGirl.create(:quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'POPULATION', unit: 'Number', tooltip_text: 'Population per municipality', frontend_name: 'Population')
  end
  let(:soy_tn) do
    Quant.find_by_name('SOY_TN') ||
    FactoryGirl.create(:quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: true, name: 'SOY_TN', unit: 'Tn', tooltip_text: 'Production of soy in Tn.', frontend_name: 'Production of soy')
  end
  let(:potential_soy_deforestation_v2) do
    Quant.find_by_name('POTENTIAL_SOY_DEFORESTATION_V2') ||
    FactoryGirl.create(:quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: true, name: 'POTENTIAL_SOY_DEFORESTATION_V2', unit: 'Ha', tooltip_text: 'Maximum potential soy-related deforestation (ha). Calculated as the maximum deforestation in the year prior to soy being harvested that could be attributable to soy expansion for that harvest. As an example, in a municipality with 1000 ha of soy expansion between 2014-2015, but only 400 ha of deforestation in 2014, the potential soy-related deforestation during 2014 could not be more than 400 ha. The remaining 600 ha of soy, at a minimum, expanded onto non-forest land, typically cattle pasture. This expansion may contribute towards the displacement of other land uses into forest land, a phenomenon known as indirect land-use change. Calculated only for forested and wooded biomes - the Amazon, Cerrado and Atlantic Forest. Clearance of native vegetation in Brazil´s other biomes (Caatinga, Pantanal and Pampas) is not considered as deforestation in this indicator.', frontend_name: 'Maximum soy deforestation')
  end
  let(:soy_) do
    Quant.find_by_name('SOY_') ||
    FactoryGirl.create(:quant, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'SOY_', unit: 'Tn', tooltip_text: 'Total exports in Tn of soy equivalents', frontend_name: 'Soy exports for trader')
  end
  let(:agrosatelite_soy_defor_) do
    Quant.find_by_name('AGROSATELITE_SOY_DEFOR_') ||
    FactoryGirl.create(:quant, actor_factsheet: true, place_factsheet: true, place_factsheet_temporal: true, name: 'AGROSATELITE_SOY_DEFOR_', unit: 'Tn', tooltip_text: 'Annual deforestation due to direct conversion for soy (ha) (currently only in Cerrado biome, 2010-2013). Calculated by crossing per-pixel annual deforestation alerts and soy crop maps.', frontend_name: 'Soy deforestation (Cerrado only)')
  end
  let(:volume) do
    Quant.find_by_name('Volume') ||
    FactoryGirl.create(:quant, actor_factsheet: false, place_factsheet: false, place_factsheet_temporal: false, name: 'Volume', unit: 'Tn', frontend_name: 'Trade volume')
  end
  let(:land_use) do
    Quant.find_by_name('LAND_USE') ||
    FactoryGirl.create(:quant, actor_factsheet: false, place_factsheet: false, place_factsheet_temporal: false, name: 'LAND_USE', unit: 'Ha', frontend_name: 'Land use')
  end
  let(:biodiversity) do
    Quant.find_by_name('BIODIVERSITY') ||
    FactoryGirl.create(:quant, actor_factsheet: true, place_factsheet: true, place_factsheet_temporal: false, name: 'BIODIVERSITY', unit: 'Unitless', frontend_name: 'Loss of biodiversity habitat')
  end
  let(:ghg_) do
    Quant.find_by_name('GHG_') ||
    FactoryGirl.create(:quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'GHG_', unit: 'Mt/yr', frontend_name: 'Loss of biodiversity habitat')
  end
end
