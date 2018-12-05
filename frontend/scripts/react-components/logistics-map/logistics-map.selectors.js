import logisticsMapLayers from 'named-maps/logistics-map_named_maps_carto';
import entries from 'lodash/entries';
import { CARTO_BASE_URL } from 'constants';

export const getLogisticsMapLayers = () => {
  const layers = logisticsMapLayers[NAMED_MAPS_ENV] || {};
  return entries(layers).map(([name, layer]) => ({
    name,
    opacity: 1,
    active: true,
    id: layer.uid,
    type: 'layer',
    provider: 'leaflet',
    layerConfig: {
      body: {
        format: 'image/png',
        minzoom: 2,
        maxzoom: 20
      },
      type: 'tileLayer',
      service: 'leaflet',
      url: `${CARTO_BASE_URL}${layer.layergroupid}/{z}/{x}/{y}.png`
    }
  }));
};
