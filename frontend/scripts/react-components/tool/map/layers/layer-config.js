// z-index from 1-100
export const getLayerOrder = (baseLayerInfoId, unitLayerIds, logisticLayerIds) => {
  const layerOrder = {
    brazil_biomes: 100,
    'brazil_biomes-labels': 100,
    ar_biomes_20191113: 100,
    'ar_biomes_20191113-labels': 100,
    colombia_regional_autonomous_corps: 100,
    'colombia_regional_autonomous_corps-labels': 100,
    brazil_states: 99,
    'brazil_states-labels': 90,
    ar_province_mainland_20191122: 99,
    'ar_province_mainland_20191122-labels': 99,
    brazil_protected: 50,
    argentina_protected_areas_20191117: 50,
    colombia_protected_areas: 50,
    paraguay_protected_areas_2018_11_14: 50,
    brazil_defor_alerts: 50,
    py_deforestation_2013_2017_20190131: 50,
    argentina_deforestation_2015_2017_20191128: 50,
    paraguay_ecoregions_2018_11_14: 50,
    'paraguay_ecoregions_2018_11_14-labels': 50,
    paraguay_indigenous_areas_2018_11_14: 40,
    brazil_indigenous_areas: 40,
    brazil_water_scarcity: 10,
    landtenure: 10,
    [baseLayerInfoId]: 1
  };
  if (unitLayerIds) {
    unitLayerIds.forEach(id => {
      layerOrder[id] = 2;
    });
  }
  if (logisticLayerIds) {
    logisticLayerIds.forEach(id => {
      layerOrder[id] = 3;
    });
  }
  return layerOrder;
};
