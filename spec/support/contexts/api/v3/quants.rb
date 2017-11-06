shared_context 'api v3 quants' do
  let(:api_v3_area) do
    FactoryGirl.create(:api_v3_quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'AREA_KM2', unit: 'km2', unit_type: 'area', tooltip_text: 'Municipal area according in Km2', frontend_name: 'Area')
  end
  let(:api_v3_land_conflicts) do
    FactoryGirl.create(:api_v3_quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'LAND_CONFL', unit: 'Number', unit_type: 'count', tooltip_text: 'Number of land conflicts per municipality', frontend_name: 'Land conflicts (2014)')
  end
  let(:api_v3_force_labour) do
    FactoryGirl.create(:api_v3_quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'SLAVERY', unit: 'Number', unit_type: 'count', tooltip_text: 'Number of people involved in lawsuits relating to cases fo forced labor or degrading working conditions', frontend_name: 'Reported cases of forced labour (2014)')
  end
  let(:api_v3_embargoes) do
    FactoryGirl.create(:api_v3_quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'EMBARGOES_', unit: 'Number', unit_type: 'count', tooltip_text: 'Number of fines and embargos associated with infringements of environmental legislations per municipality', frontend_name: 'Number of environmental embargos (2015)')
  end
  let(:api_v3_fob) do
    FactoryGirl.create(:api_v3_quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'FOB', unit: 'USD', tooltip_text: 'Value of commodity shipments', frontend_name: 'Financial flow')
  end
  let(:api_v3_deforestation_v2) do
    FactoryGirl.create(:api_v3_quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: true, name: 'DEFORESTATION_V2', unit: 'Ha', tooltip_text: 'Total deforestation per municipality for a given year (ha). Calculated only for forested and wooded biomes - the Amazon, Cerrado and Atlantic Forest. Clearance of native vegetation in Brazil´s other biomes (Caatinga, Pantanal and Pampas) is not considered as deforestation in this indicator.', frontend_name: 'Territorial deforestation')
  end
  let(:api_v3_population) do
    FactoryGirl.create(:api_v3_quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'POPULATION', unit: 'Number', tooltip_text: 'Population per municipality', frontend_name: 'Population')
  end
  let(:api_v3_soy_tn) do
    FactoryGirl.create(:api_v3_quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: true, name: 'SOY_TN', unit: 'Tn', tooltip_text: 'Production of soy in Tn.', frontend_name: 'Production of soy')
  end
  let(:api_v3_potential_soy_deforestation_v2) do
    FactoryGirl.create(:api_v3_quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: true, name: 'POTENTIAL_SOY_DEFORESTATION_V2', unit: 'Ha', tooltip_text: 'Maximum potential soy-related deforestation (ha). Calculated as the maximum deforestation in the year prior to soy being harvested that could be attributable to soy expansion for that harvest. As an example, in a municipality with 1000 ha of soy expansion between 2014-2015, but only 400 ha of deforestation in 2014, the potential soy-related deforestation during 2014 could not be more than 400 ha. The remaining 600 ha of soy, at a minimum, expanded onto non-forest land, typically cattle pasture. This expansion may contribute towards the displacement of other land uses into forest land, a phenomenon known as indirect land-use change. Calculated only for forested and wooded biomes - the Amazon, Cerrado and Atlantic Forest. Clearance of native vegetation in Brazil´s other biomes (Caatinga, Pantanal and Pampas) is not considered as deforestation in this indicator.', frontend_name: 'Maximum soy deforestation')
  end
  let(:api_v3_soy_) do
    FactoryGirl.create(:api_v3_quant, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'SOY_', unit: 'Tn', tooltip_text: 'Total exports in Tn of soy equivalents', frontend_name: 'Soy exports for trader')
  end
  let(:api_v3_agrosatelite_soy_defor_) do
    FactoryGirl.create(:api_v3_quant, actor_factsheet: true, place_factsheet: true, place_factsheet_temporal: true, name: 'AGROSATELITE_SOY_DEFOR_', unit: 'Tn', tooltip_text: 'Annual deforestation due to direct conversion for soy (ha) (currently only in Cerrado biome, 2010-2013). Calculated by crossing per-pixel annual deforestation alerts and soy crop maps.', frontend_name: 'Soy deforestation (Cerrado only)')
  end
  let(:api_v3_volume) do
    FactoryGirl.create(:api_v3_quant, actor_factsheet: false, place_factsheet: false, place_factsheet_temporal: false, name: 'Volume', unit: 'Tn', frontend_name: 'Trade volume')
  end
  let(:api_v3_land_use) do
    FactoryGirl.create(:api_v3_quant, actor_factsheet: false, place_factsheet: false, place_factsheet_temporal: false, name: 'LAND_USE', unit: 'Ha', frontend_name: 'Land use')
  end
  let(:api_v3_biodiversity) do
    FactoryGirl.create(:api_v3_quant, actor_factsheet: true, place_factsheet: true, place_factsheet_temporal: false, name: 'BIODIVERSITY', unit: 'Unitless', frontend_name: 'Loss of biodiversity habitat')
  end
  let(:api_v3_ghg_) do
    FactoryGirl.create(:api_v3_quant, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'GHG_', unit: 'Mt/yr', frontend_name: 'Loss of biodiversity habitat')
  end
end
