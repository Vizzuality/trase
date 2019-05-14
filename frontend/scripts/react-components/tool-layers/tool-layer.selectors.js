import { createSelector } from 'reselect';
import getChoropleth from 'reducers/helpers/getChoropleth';
import { getMapDimensionsWarnings as getMapDimensionsWarningsUtil } from 'scripts/reducers/helpers/getMapDimensionsWarnings';
import { getHighlightedNodesData } from 'react-components/tool/tool.selectors';

const getMapDimensions = state => state.toolLayers.mapDimensions;
const getSelectedMapDimensions = state => state.toolLayers.selectedMapDimensions;
const getNodesDictWithMeta = state => state.toolLayers.nodesDictWithMeta;
const getSelectedYears = state => state.app.selectedYears;

export const getChoroplethOptions = createSelector(
  [getMapDimensions, getSelectedMapDimensions, getNodesDictWithMeta],
  (mapDimensions, selectedMapDimensions, nodesDictWithMeta) =>
    getChoropleth(selectedMapDimensions, nodesDictWithMeta, mapDimensions)
);

export const getMapDimensionsWarnings = createSelector(
  [getMapDimensions, getSelectedMapDimensions, getSelectedYears],
  (mapDimensions, selectedMapDimensions, selectedYears) =>
    getMapDimensionsWarningsUtil(mapDimensions, selectedMapDimensions, selectedYears)
);

export const getCurrentHighlightedChoroplethBucket = createSelector(
  [getHighlightedNodesData, getChoropleth],
  (highlightedNodesData, choropleth) => {
    if (
      highlightedNodesData.length === 1 &&
      highlightedNodesData[0].geoId !== null &&
      choropleth !== undefined
    ) {
      return choropleth[highlightedNodesData[0].geoId] || 'ch-default';
    }

    return undefined;
  }
);
