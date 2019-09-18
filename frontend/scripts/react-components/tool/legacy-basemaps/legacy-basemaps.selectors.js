import { DEFAULT_BASEMAP_FOR_CHOROPLETH } from 'constants';
import { getSelectedMapDimensionsUids } from 'react-components/tool-layers/tool-layers.selectors';
import { getSelectedContext } from 'reducers/app.selectors';

const shouldUseDefaultBasemap = state => {
  const selectedMapDimensions = getSelectedMapDimensionsUids(state);
  return selectedMapDimensions.filter(d => d !== null).length > 0;
};

export default state => {
  const selectedContext = getSelectedContext(state);
  if (shouldUseDefaultBasemap(state)) {
    return DEFAULT_BASEMAP_FOR_CHOROPLETH;
  }
  return state.toolLayers.selectedBasemap || selectedContext?.defaultBasemap || 'satellite';
};

export { shouldUseDefaultBasemap };
