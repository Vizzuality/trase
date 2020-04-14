import { CARTO_BASE_URL } from 'constants';

const getFilter = (condition, name, value) => ['all', [condition, ['get', name], value]];

export const conditionalRenderLayers = ({
  type,
  options,
  metadata,
  name,
  baseLayout = {},
  basePaint = {}
}) =>
  options.map(o => ({
    type,
    filter: getFilter(o.condition, name, o.value),
    layout: { ...baseLayout, ...o.layout },
    paint: { ...basePaint, ...o.paint },
    metadata
  }));

export const layer = ({ name, type, provider, sql, renderLayers, id }) => {
  const baseLayer = {
    id: name,
    version: '0.0.1',
    type,
    source: {
      type
    }
  };

  if (type === 'geojson') {
    baseLayer.source = {
      ...baseLayer.source,
      data: `${CARTO_BASE_URL}/sql?q=SELECT ST_Centroid(the_geom) as the_geom_webmercator, ST_Centroid(the_geom) as the_geom, cartodb_id, name FROM ${id}&format=geojson`
    };
  }
  if (provider === 'carto') {
    baseLayer.source.provider = {
      type: 'carto',
      account: 'p2cs-sei',
      layers: [
        {
          options: {
            sql
          }
        }
      ]
    };
  }
  const sourceLayer = type === 'vector' ? { 'source-layer': 'layer0' } : {};
  baseLayer.render = {
    layers: renderLayers.map(l => ({
      ...sourceLayer,
      type: l.type,
      paint: l.paint,
      layout: l.layout,
      filter: l.filter,
      metadata: l.metadata
    }))
  };
  return baseLayer;
};
