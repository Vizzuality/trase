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
import snakeCase from 'lodash/snakeCase';

const getToolNodes = state => state.toolLinks.data.nodes;
const getToolColumns = state => state.toolLinks.data.columns;
const getUnitLayers = state => state.toolLayers.data.mapUnitLayers || null;
const getToolNodeAttributes = state => state.toolLinks.data.nodeAttributes;
const getToolMapDimensions = state => state.toolLayers.data.mapDimensions;
const getMapContextualLayers = state => state.toolLayers.data.mapContextualLayers;
const getToolSelectedMapDimensions = state => state.toolLayers.selectedMapDimensions;
const getSelectedMapContextualLayers = state => state.toolLayers.selectedMapContextualLayers;
const getSelectedLogisticLayers = state => state.toolLayers.selectedLogisticLayers;
const getToolMapView = state => state.toolLayers.mapView;
const getToolLayout = state => state.toolLayers.toolLayout;
const getSelectedBasemap = state => state.toolLayers.selectedBasemap;

const getGeoNodes = (nodesData, columns, selectedContext) => {
  if (columns) {
    return nodesData
      .filter(node => {
        const column = columns[node.columnId];
        return column.isGeo === true && typeof node.geoId !== 'undefined' && node.geoId !== null;
      })
      .map(node => {
        const column = columns[node.columnId];
        const layerId =
          selectedContext && `${snakeCase(selectedContext.countryName)}_${snakeCase(column.name)}`;
        return { ...node, layerId };
      });
  }
  return [];
};

export const getSelectedGeoNodes = createSelector(
  [getSelectedNodesData, getToolColumns, getSelectedContext],
  getGeoNodes
);

export const getHighlightedGeoNodes = createSelector(
  [getHighlightedNodesData, getToolColumns, getSelectedContext],
  getGeoNodes
);

export const getSelectedNodesGeoIds = createSelector([getSelectedGeoNodes], geoNodes =>
  geoNodes ? geoNodes.map(node => node.geoId) : []
);

export const getHighlightedNodesGeoIds = createSelector([getHighlightedGeoNodes], geoNodes =>
  geoNodes ? geoNodes.map(n => n.map(node => node.geoId)) : []
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
    if (!selectedGeoColumn || selectedGeoColumn.isChoroplethDisabled) {
      return [null, null];
    }

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

export const getAllSelectedGeoColumns = createSelector(
  [getToolColumns, getSelectedColumnsIds],
  (columns, selectedColumnsIds) => {
    if (!columns) return null;
    const selectedGeoColumns = Object.values(columns).filter(
      column => column.isGeo && selectedColumnsIds.includes(column.id)
    );
    return selectedGeoColumns;
  }
);

// Layers with different geometries depeinding on the selected year
const layersWithYears = {
  indonesia_concession_wood_pulp: [
    { firstYear: 2015, lastYear: 2019 },
    { firstYear: 2020, lastYear: 2022 }
  ]
};

// TODO: Please move this logic to the CMS as is getting really messy
export const getSelectedUnitLayers = createSelector(
  [getUnitLayers, getToolColumns, getSelectedContext, getAllSelectedGeoColumns, getSelectedYears],
  (unitLayers, columns, selectedContext, selectedGeoColumns, selectedYears) => {
    if (!unitLayers || !selectedContext || !selectedGeoColumns) return null;
    // Use geometryNodeTypeId column for columns without own geometry e.g. logistic hubs
    const geoColumns = selectedGeoColumns.map(c =>
      c.geometryNodeTypeId ? columns[c.geometryNodeTypeId] : c
    );

    const countryName = snakeCase(selectedContext.countryName);
    const columnName = c => snakeCase(c.name);
    const selectedUnitLayers = [];

    // Exceptions inside the same country-column for each commodity
    const exceptions = [
      'indonesia_country_of_production_wood_pulp',
      'indonesia_province_wood_pulp',
      'indonesia_province_of_production_wood_pulp',
      'indonesia_province_of_production_wood_pulp'
    ];

    // Changes in the column names
    const changes = {
      indonesia_wood_supplier: 'indonesia_concession_wood_pulp'
    };

    geoColumns.forEach(geoColumn => {
      let layerId = `${countryName}_${columnName(geoColumn)}`;
      const exceptionId = `${layerId}_${snakeCase(selectedContext.commodityName)}`;

      if (exceptions.includes(exceptionId)) {
        layerId = exceptionId;
      }

      if (changes[layerId]) {
        layerId = changes[layerId];
      }

      if (layersWithYears[layerId]) {
        const [firstSelectedYear, lastSelectedYear] = selectedYears;
        const layerWithYears = layersWithYears[layerId].find(({ firstYear, lastYear }) => {
          const matchingRangeLayer = firstSelectedYear >= firstYear && lastSelectedYear <= lastYear;
          // If there is not a match with the range, return the last layer on the range
          return matchingRangeLayer || lastSelectedYear <= lastYear;
        });
        if (layerWithYears) {
          layerId = `${layerId}_years-${layerWithYears.firstYear}-${layerWithYears.lastYear}`;
        }
      }

      // columns of production are the same than their respective without the of_production part
      const unitLayer = unitLayers.find(
        l => l.id === layerId || l.id === layerId.replace('_of_production', '')
      );

      if (unitLayer) {
        selectedUnitLayers.push({ ...unitLayer, hasChoropleth: !geoColumn.isChoroplethDisabled });
      }
    });
    return selectedUnitLayers;
  }
);

export const getUnitLayerWarnings = createSelector(
  [getSelectedUnitLayers, getSelectedYears],
  (selectedUnitLayers, selectedYears) => {
    if (
      !selectedUnitLayers ||
      selectedYears.length === 0 ||
      !selectedUnitLayers.some(l => l.id.includes('years'))
    ) {
      return null;
    }
    const selectedUnitLayersIds = selectedUnitLayers.map(layer => layer.id);
    const warnings = [];
    selectedUnitLayersIds.forEach(id => {
      const availableYearRanges = Object.entries(layersWithYears).find(([rangesId]) =>
        id.startsWith(rangesId)
      )?.[1];
      if (!availableYearRanges) return;
      const [selectedFirstYear, selectedLastYear] = selectedYears;

      const containsMultipleYearRanges =
        availableYearRanges.filter(
          ({ firstYear, lastYear }) =>
            !(lastYear < selectedFirstYear || firstYear > selectedLastYear)
        ).length > 1;

      if (containsMultipleYearRanges) {
        warnings.push('YEAR_RANGE_WARNING');
      }
    });
    return warnings;
  }
);

export const getToolLayersUrlProps = createStructuredSelector({
  mapView: getMapView,
  toolLayout: getToolLayout,
  selectedBasemap: getSelectedBasemap,
  selectedMapDimensions: getToolSelectedMapDimensions,
  selectedMapContextualLayers: getSelectedMapContextualLayers,
  selectedLogisticLayers: getSelectedLogisticLayers
});
