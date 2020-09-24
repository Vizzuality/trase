import { CARTO_BASE_URL } from 'constants';
import castArray from 'lodash/castArray';

export const getFilter = (condition, name, value) => {
  const filter = ['all'];
  castArray(value).forEach(v => {
    filter.push([condition, ['get', name], v]);
  });
  return filter;
};

export const conditionalRenderLayers = ({
  type,
  zooms,
  metadata,
  name,
  baseLayout = {},
  basePaint = {},
}) => (zooms.flatMap(z => {
    if (z.filters) {
      return z.filters.map(o => ({
        minzoom: z.minZoom,
        maxzoom: z.maxZoom,
        type,
        filter: getFilter(o.condition, o.name || name, o.value),
        layout: { ...baseLayout, ...z.layout, ...o.layout },
        paint: { ...basePaint, ...z.paint, ...o.paint },
        metadata
      }));
    }
    return ({
      type,
      layout: { ...baseLayout, ...z.layout },
      paint: { ...basePaint, ...z.paint },
      metadata,
      minzoom: z.minZoom,
      maxzoom: z.maxZoom,
    });
  })
);

export const layer = ({ name, type, provider, sql, renderLayers, id, variables=['name'], unitLayer }) => {
  const baseLayer = {
    id: name,
    version: '0.0.1',
    type,
    source: {
      type
    }
  };

  if (type === 'geojson') {
    const fetchedVariables = variables.join(', ');
    baseLayer.source = {
      ...baseLayer.source,
      data: unitLayer ? `${CARTO_BASE_URL}/sql?q=SELECT cartodb_id,the_geom,the_geom_webmercator,${fetchedVariables} FROM ${id}&format=geojson` :
        `${CARTO_BASE_URL}/sql?q=SELECT ST_Centroid(the_geom) as the_geom_webmercator, ST_Centroid(the_geom) as the_geom, cartodb_id, ${fetchedVariables} FROM ${id}&format=geojson`
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
      ...l
    }))
  };
  return baseLayer;
};
