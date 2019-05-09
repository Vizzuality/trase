import { DEFAULT_BASEMAP_FOR_CHOROPLETH } from 'constants';

const shouldUseDefaultBasemap = state =>
  state.selectedMapDimensions &&
  state.selectedMapDimensions.length &&
  state.selectedMapDimensions.filter(d => d !== null).length > 0;

export default state =>
  shouldUseDefaultBasemap(state) ? DEFAULT_BASEMAP_FOR_CHOROPLETH : state.selectedMapBasemap;

export { shouldUseDefaultBasemap };
