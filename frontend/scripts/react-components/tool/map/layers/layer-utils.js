import { CARTO_BASE_URL } from 'constants';
import castArray from 'lodash/castArray';

export const getFilter = (condition, name, value, decision) => {
  const filter = [decision || 'all'];
  if (!value) {
    return null;
  }
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
        ...(z.minzoom && { minzoom: z.minzoom }),
        ...(z.maxzoom && { maxzoom: z.maxzoom }),
        type,
        ...(o.value && {
          filter: getFilter(o.condition, o.name || name, o.value)
        }),
        layout: { ...baseLayout, ...z.layout, ...o.layout },
        paint: { ...basePaint, ...z.paint, ...o.paint },
        ...(metadata && { metadata })
      }));
    }
    return ({
      type,
      layout: { ...baseLayout, ...z.layout },
      paint: { ...basePaint, ...z.paint },
      metadata,
      minzoom: z.minzoom,
      maxzoom: z.maxzoom,
    });
  })
);

export const layer = ({
  name, bounds, center, minzoom, maxzoom, type, source, sourceLayer, provider, sql, renderLayers, id, variables=['name'], unitLayer, images
}) => {
  const baseSource = {
    ...(bounds && { bounds }),
    ...(center && { center }),
    ...(minzoom && { minzoom }),
    ...(maxzoom && { maxzoom}),
  }
  const baseLayer = {
    id: name,
    version: '0.0.1',
    type,
    ...(images && { images }),
    source: {...baseSource, ...(source || baseSource)}
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
  const sourceLayerAttributes = type === 'vector' ? { 'source-layer': sourceLayer || 'layer0' } : {};
  baseLayer.render = {
    layers: renderLayers.map(l => ({
      ...sourceLayerAttributes,
      ...l
    }))
  };
  return baseLayer;
};
