export const baseLayer = (baseLayerInfo) => ({
  id: baseLayerInfo.id,
  type: 'raster',
  source: {
    type: 'raster',
    tiles: [baseLayerInfo.url],
    minzoom: 2,
    maxzoom: 12
  }
});
