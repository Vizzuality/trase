import { createSelector } from 'reselect';
import { COUNTRIES_COORDINATES } from 'scripts/countries';
import bbox from '@turf/bbox';
import lineString from 'turf-linestring';
import { getTopNodesKey } from 'react-components/explore/explore.actions';

const getSelectedContext = state => state.app.selectedContext;
const getSelectedYears = state => state.app.selectedYears;
const getTopNodes = state => state.explore.topNodes;

export const getOriginGeoId = createSelector(
  getSelectedContext,
  selectedContext => (selectedContext ? selectedContext.worldMap.geoId : null)
);

export const getOriginCoordinates = createSelector(
  getOriginGeoId,
  originGeoId => (originGeoId ? COUNTRIES_COORDINATES[originGeoId] : null)
);

export const getCountries = createSelector(
  [getTopNodes, getSelectedContext, getSelectedYears],
  (topNodes, selectedContext, selectedYears) => {
    const selectedContextId = selectedContext ? selectedContext.id : null;
    const topNodesKey = getTopNodesKey(selectedContextId, 'country', ...selectedYears);
    return topNodes[topNodesKey];
  }
);

export const getWorldMapFlows = createSelector(
  [getOriginGeoId, getOriginCoordinates, getCountries],
  (originGeoId, originCoordinates, countries) => {
    if (!originGeoId || !originCoordinates || !countries) {
      return [];
    }

    const contextFlows = countries
      ? countries
          .filter(country => country.geoId !== originGeoId)
          .sort((a, b) => {
            if (a.value < b.value) return -1;
            if (a.value > b.value) return 1;
            return 0;
          })
          .map((country, index) => ({
            ...country,
            strokeWidth: index + 1
          }))
      : [];

    const contextFlowsWithCoordinates = contextFlows.filter(
      f => typeof f.coordinates !== 'undefined'
    );

    if (contextFlowsWithCoordinates.length !== contextFlows.length) {
      console.warn('World map flows are missing geoids. Check your database.');
    }

    const [minX, , maxX] = bbox(lineString(contextFlowsWithCoordinates.map(f => f.coordinates)));
    const medianX = (maxX + minX) / 2;
    const originLeftOfBbox = originCoordinates[0] < medianX;
    const pointOfControl = {
      x: originLeftOfBbox ? minX - 10 : maxX + 10
    };

    const getCurveStyle = destination => {
      if (destination[0] < pointOfControl.x) {
        // left
        return 'forceDown';
      }
      // right
      return 'forceUp';
    };

    return contextFlowsWithCoordinates.map(destination => ({
      ...destination,
      curveStyle: getCurveStyle(destination.coordinates)
    }));
  }
);
