import { DEFAULT_BASEMAP_FOR_CHOROPLETH } from 'constants';
import { getSelectedMapDimensionsUids } from 'react-components/tool/tool.selectors';

const shouldUseDefaultBasemap = state => {
  const selectedMapDimensions = getSelectedMapDimensionsUids(state);
  return selectedMapDimensions.filter(d => d !== null).length > 0;
};

export default state =>
  shouldUseDefaultBasemap(state)
    ? DEFAULT_BASEMAP_FOR_CHOROPLETH
    : state.toolLayers.selectedMapBasemap ||
      state.app.selectedContext?.defaultBasemap ||
      'satellite';

export { shouldUseDefaultBasemap };
