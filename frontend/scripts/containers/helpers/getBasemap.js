import { DEFAULT_BASEMAP_FOR_CHOROPLETH } from 'constants';

const useDefaultBasemap = (state) => {
  if ((state.selectedMapDimensions && state.selectedMapDimensions.length && state.selectedMapDimensions.filter(d => d !== null).length > 0)) {
    return true;
  }
  return false;
};

export default (state) => {
  return useDefaultBasemap(state) ? DEFAULT_BASEMAP_FOR_CHOROPLETH : state.selectedMapBasemap;
};

export { useDefaultBasemap };
