import { createSelector, createStructuredSelector } from 'reselect';
import getChoropleth from 'app/helpers/getChoropleth';
import { DEFAULT_BASEMAP_FOR_CHOROPLETH } from 'constants';
import { getMapDimensionsWarnings as getMapDimensionsWarningsUtil } from 'app/helpers/getMapDimensionsWarnings';
import {
  getHighlightedNodesData,
  getSelectedColumnsIds,
  getSelectedNodesData
} from 'react-components/tool/tool.selectors';
import { getSelectedYears, getSelectedContext } from 'app/app.selectors';

const getToolNodes = state => state.toolLinks.data.nodes;
const getToolColumns = state => state.toolLinks.data.columns;
const getUnitLayers = state => state.toolLayers.data.mapUnitLayers || null;
const getToolNodeAttributes = state => state.toolLinks.data.nodeAttributes;
const getToolMapDimensions = state => state.toolLayers.data.mapDimensions;
const getMapContextualLayers = state => state.toolLayers.data.mapContextualLayers;
const getToolSelectedMapDimensions = state => state.toolLayers.selectedMapDimensions;
const getSelectedMapContextualLayers = state => state.toolLayers.selectedMapContextualLayers;
const getToolMapView = state => state.toolLayers.mapView;
const getToolLayout = state => state.toolLayers.toolLayout;
const getSelectedBasemap = state => state.toolLayers.selectedBasemap;

const getNodesGeoIds = (nodesData, columns) => {
  if (columns) {
    return nodesData
      .filter(node => {
        const column = columns[node.columnId];
        return column.isGeo === true && typeof node.geoId !== 'undefined' && node.geoId !== null;
      })
      .map(node => node.geoId);
  }
  return [];
};

export const getSelectedNodesGeoIds = createSelector(
  [getSelectedNodesData, getToolColumns],
  getNodesGeoIds
);

export const getHighlightedNodesGeoIds = createSelector(
  [getHighlightedNodesData, getToolColumns],
  getNodesGeoIds
);

export const getSelectedGeoColumn = createSelector(
  [getToolColumns, getSelectedColumnsIds],
  (columns, selectedColumnsIds) => {
    if (!columns) return null;
    const selectedGeoColumns = Object.values(columns).filter(
      column => column.isGeo && selectedColumnsIds.includes(column.id)
    );
    // Get extraColumn if exists as it is the last geo column
    return selectedGeoColumns[selectedGeoColumns.length - 1];
  }
);

export const getSelectedMapDimensionsUids = createSelector(
  [getSelectedGeoColumn, getToolMapDimensions, getToolSelectedMapDimensions],
  (selectedGeoColumn, mapDimensions, selectedMapDimensions) => {
    if (selectedGeoColumn && selectedGeoColumn.isChoroplethDisabled === false) {
      const allAvailableMapDimensionsUids = new Set(Object.keys(mapDimensions));
      const selectedMapDimensionsSet = new Set(selectedMapDimensions?.filter(Boolean));
      const intersection = new Set(
        [...selectedMapDimensionsSet].filter(x => allAvailableMapDimensionsUids.has(x))
      );

      // are all currently selected map dimensions available ?
      if (
        selectedMapDimensionsSet.size > 0 &&
        intersection.size === selectedMapDimensionsSet.size
      ) {
        return selectedMapDimensions;
      }

      // use default map dimensions but only if selectedMapDimensions is null
      // we want to allow the user to disable all selections
      if (!selectedMapDimensions) {
        const uids = Object.values(mapDimensions)
          .filter(dimension => dimension.isDefault)
          .map(selectedDimension => selectedDimension.uid);

        return [uids[0] || null, uids[1] || null];
      }
    }

    return [null, null];
  }
);

export const getSelectedMapDimensionsData = createSelector(
  [getSelectedMapDimensionsUids, getToolMapDimensions],
  (selectedMapDimensionsIds, mapDimensions) =>
    selectedMapDimensionsIds.filter(Boolean).map(uid => mapDimensions[uid])
);

export const getChoroplethOptions = createSelector(
  [
    getSelectedMapDimensionsUids,
    getToolNodes,
    getToolNodeAttributes,
    getSelectedColumnsIds,
    getToolColumns,
    getToolMapDimensions
  ],
  (selectedMapDimensions, nodes, attributes, selectedColumnsIds, columns, mapDimensions) => {
    if (!nodes || !attributes || !columns) {
      return { choropleth: {}, choroplethLegend: null };
    }

    return getChoropleth(
      selectedMapDimensions,
      nodes,
      attributes,
      selectedColumnsIds,
      columns,
      mapDimensions
    );
  }
);

export const getMapDimensionsWarnings = createSelector(
  [getToolMapDimensions, getSelectedMapDimensionsUids, getSelectedYears],
  (mapDimensions, selectedMapDimensions, selectedYears) => {
    if (selectedYears.length === 0) {
      return null;
    }
    return getMapDimensionsWarningsUtil(mapDimensions, selectedMapDimensions, selectedYears);
  }
);

export const getCurrentHighlightedChoroplethBucket = createSelector(
  [getHighlightedNodesData, getChoroplethOptions],
  (highlightedNodesData, choroplethOptions) => {
    const { choropleth } = choroplethOptions;
    if (
      highlightedNodesData.length === 1 &&
      highlightedNodesData[0].geoId !== null &&
      typeof choropleth !== 'undefined'
    ) {
      return choropleth[highlightedNodesData[0].geoId] || 'ch-default';
    }

    return undefined;
  }
);

export const getSelectedMapContextualLayersData = createSelector(
  [getSelectedMapContextualLayers, getMapContextualLayers],
  (selectedMapContextualLayers, mapContextualLayers) => {
    if (!selectedMapContextualLayers) {
      return [];
    }
    return selectedMapContextualLayers.map(layer => mapContextualLayers[layer]).filter(Boolean);
  }
);

export const getBasemap = createSelector(
  [getSelectedContext, getSelectedBasemap, getSelectedMapDimensionsUids],
  (selectedContext, selectedBasemap, selectedMapDimensions) => {
    const defaultBasemap =
      selectedMapDimensions.filter(d => d !== null).length > 0
        ? DEFAULT_BASEMAP_FOR_CHOROPLETH
        : selectedContext?.defaultBasemap || 'satellite';
    return selectedBasemap || defaultBasemap;
  }
);

export const getMapView = createSelector(
  [getToolMapView, getSelectedContext],
  (mapView, selectedContext) => {
    if (!mapView || !selectedContext) {
      return null;
    }

    const lat = selectedContext.map.latitude.toFixed(2);
    const lng = selectedContext.map.longitude.toFixed(2);

    if (
      mapView.latitude === lat &&
      mapView.longitude === lng &&
      mapView.zoom === selectedContext.map.zoom
    ) {
      return null;
    }

    return mapView;
  }
);

export const getShouldFitBoundsSelectedPolygons = createSelector(
  [getSelectedNodesGeoIds, getSelectedNodesData],
  (selectedNodesGeoIds, selectedNodesData) =>
    selectedNodesGeoIds.length === selectedNodesData.length
);

export const getSelectedUnitLayer = createSelector(
  [getUnitLayers, getSelectedGeoColumn],
  (unitLayers, selectedGeoColumn) => {
    if (!unitLayers || !selectedGeoColumn) return null;
    const columnName = selectedGeoColumn.name;

    // Temporary until we fix the layer names. They should be COUNTRY_REGION e.g BRAZIL_MUNICIPALITY
    const selectedLayer = unitLayers.find(l => {
      if (columnName === 'MUNICIPALITY') {
        return l.id === 'municipalities'
      }
      if (columnName === 'STATES') {
        return l.id === 'states'
      }
      return null;
    });
    if (selectedLayer) {
      return selectedLayer;
    }

    // Layers are in the format COUNTRY_REGION e.g BRAZIL_MUNICIPALITY
    return unitLayers.find(l => l.id.split('_') && l.id.split('_')[1] === columnName) || null;
  }
);

export const getToolLayersUrlProps = createStructuredSelector({
  mapView: getMapView,
  toolLayout: getToolLayout,
  selectedBasemap: getSelectedBasemap,
  selectedMapDimensions: getToolSelectedMapDimensions,
  selectedMapContextualLayers: getSelectedMapContextualLayers
});
