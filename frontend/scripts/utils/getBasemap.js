import { DEFAULT_BASEMAP_FOR_CHOROPLETH } from 'constants';

const shouldUseDefaultBasemap = state =>
  state.toolLayers.selectedMapDimensions &&
  state.toolLayers.selectedMapDimensions.length &&
  state.toolLayers.selectedMapDimensions.filter(d => d !== null).length > 0;

export default state =>
  shouldUseDefaultBasemap(state)
    ? DEFAULT_BASEMAP_FOR_CHOROPLETH
    : state.toolLayers.selectedMapBasemap ||
      state.app.selectedContext?.defaultBasemap ||
      'satellite';

export { shouldUseDefaultBasemap };
