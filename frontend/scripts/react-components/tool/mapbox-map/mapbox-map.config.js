import omit from 'lodash/omit';

export const providers = {
  topojson: (layerModel, layer, resolve, reject) => {
    const { source } = layerModel;
    const { provider } = source;

    // TODO: Parse the topojson into geoJson

    fetch("get", provider.url, provider.options, layerModel)
      .then(response => (
        resolve({
          ...layer,
          source: {
            ...omit(layer.source, "provider"),
            data: {
              type: "FeatureCollection",
              features: response.rows.map(r => ({
                type: "Feature",
                properties: r,
                geometry: {
                  type: "Point",
                  coordinates: [r.lon, r.lat]
                }
              }))
            }
          }
        })
      ))
      .catch(e => {
        reject(e);
      });
  }
};