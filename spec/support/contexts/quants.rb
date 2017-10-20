shared_context 'quants' do
  let(:area) {
    FactoryGirl.create(:quant, place_factsheet: true, place_factsheet_temporal: false, name: 'AREA_KM2', unit: 'km2', unit_type: 'area', tooltip_text: 'Municipal area according in Km2', frontend_name: 'Area')
  }
  let(:land_conflicts) {
    FactoryGirl.create(:quant, place_factsheet: true, place_factsheet_temporal: false, name: 'LAND_CONFL', unit: 'Number', unit_type: 'count', tooltip_text: 'Number of land conflicts per municipality', frontend_name: 'Land conflicts (2014)')
  }
  let(:force_labour) {
    FactoryGirl.create(:quant, place_factsheet: true, place_factsheet_temporal: false, name: 'SLAVERY', unit: 'Number', unit_type: 'count', tooltip_text: 'Number of people involved in lawsuits relating to cases fo forced labor or degrading working conditions', frontend_name: 'Reported cases of forced labour (2014)')
  }
  let(:embargoes) {
    FactoryGirl.create(:quant, place_factsheet: true, place_factsheet_temporal: false, name: 'EMBARGOES_', unit: 'Number', unit_type: 'count', tooltip_text: 'Number of fines and embargos associated with infringements of environmental legislations per municipality', frontend_name: 'Number of environmental embargos (2015)')
  }
  let(:fob){
    FactoryGirl.create(:quant, place_factsheet: true, place_factsheet_temporal: false, name: 'FOB', unit: 'USD', tooltip_text: 'Value of commodity shipments', frontend_name: 'Financial flow')
  }
  let(:deforestation_v2){
    FactoryGirl.create(:quant, place_factsheet: true, place_factsheet_temporal: true, name: 'DEFORESTATION_V2', unit: 'Ha', tooltip_text: 'Total deforestation per municipality for a given year (ha). Calculated only for forested and wooded biomes - the Amazon, Cerrado and Atlantic Forest. Clearance of native vegetation in Brazil´s other biomes (Caatinga, Pantanal and Pampas) is not considered as deforestation in this indicator.', frontend_name: 'Territorial deforestation')
  }
  let(:population){
    FactoryGirl.create(:quant, place_factsheet: true, place_factsheet_temporal: false, name: 'POPULATION', unit: 'Number', tooltip_text: 'Population per municipality', frontend_name: 'Population')
  }
  let(:soy_tn){
    FactoryGirl.create(:quant, place_factsheet: true, place_factsheet_temporal: true, name: 'SOY_TN', unit: 'Tn', tooltip_text: 'Production of soy in Tn.', frontend_name: 'Production of soy')
  }
end
