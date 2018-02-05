import { DEFAULT_BASEMAP_FOR_CHOROPLETH } from 'constants';

const useDefaultBasemap = state =>
  state.selectedMapDimensions &&
  state.selectedMapDimensions.length &&
  state.selectedMapDimensions.filter(d => d !== null).length > 0;

export default state =>
  useDefaultBasemap(state) ? DEFAULT_BASEMAP_FOR_CHOROPLETH : state.selectedMapBasemap;

export { useDefaultBasemap };
