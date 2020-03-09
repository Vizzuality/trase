import { createSelector } from 'reselect';
import { COUNTRIES_COORDINATES } from 'scripts/countries';
import bbox from '@turf/bbox';
import lineString from 'turf-linestring';
import greatCircle from '@turf/great-circle';
import { geoPath } from 'd3-geo';
import projections from 'react-simple-maps/lib/projections';
import { getContexts } from 'react-components/explore/explore.selectors';
import { WORLD_MAP_ASPECT_RATIO } from 'constants';

const getSelectedContext = (state, { context }) => context;
const getHighlightedCountryIds = (state, { highlightedCountryIds }) => highlightedCountryIds;
const getCountries = (state, { destinationCountries }) => destinationCountries;
const getWidth = (state, { width }) => width;
const getScale = (state, { scale }) => scale;

const getWorldMapProjection = createSelector([getWidth, getScale], (width, scale) =>
  projections(
    width || 800,
    width ? Math.round(width * WORLD_MAP_ASPECT_RATIO) : 448,
    {
      scale: scale || 140,
      rotation: [0, 0, 0]
    },
    'robinson'
  )
);

export const getOriginGeoId = createSelector(getSelectedContext, selectedContext =>
  selectedContext ? selectedContext.worldMap.geoId : null
);

export const getOriginCoordinates = createSelector(getOriginGeoId, originGeoId =>
  originGeoId ? COUNTRIES_COORDINATES[originGeoId] : null
);

function buildCustomArc(originCoords, destinationCoords, worldMapProjection) {
  const [minX, , maxX] = bbox(lineString(destinationCoords));
  const medianX = (maxX + minX) / 2;
  const originLeftOfBbox = originCoords[0] < medianX;
  const pointOfControl = {
    x: originLeftOfBbox ? minX - 10 : maxX + 10
  };

  // right
  let curveStyle = 'forceUp';
  if (destinationCoords[0] < pointOfControl.x) {
    // left
    curveStyle = 'forceDown';
  }

  const start = worldMapProjection(destinationCoords);
  const end = worldMapProjection(originCoords);

  const x0 = start[0];
  const x1 = end[0];
  const y0 = start[1];
  const y1 = end[1];

  const curve = {
    forceUp: `${x1} ${y0}`,
    forceDown: `${x0} ${y1}`
  }[curveStyle];

  return `M ${start.join(' ')} Q ${curve} ${end.join(' ')}`;
}

function buildGreatCircleArc(originCoords, destinationCoords, worldMapProjection) {
  const arc = greatCircle(originCoords, destinationCoords, { offset: 400, npoints: 100 });
  if (arc.geometry.type === 'MultiLineString') {
    return buildCustomArc(originCoords, destinationCoords, worldMapProjection);
  }
  const pathMaker = geoPath().projection(worldMapProjection);
  return pathMaker(arc);
}

export const getWorldMapFlows = createSelector(
  [getOriginGeoId, getOriginCoordinates, getCountries, getWorldMapProjection],
  (originGeoId, originCoordinates, countries, worldMapProjection) => {
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

    return contextFlowsWithCoordinates.map(flow => ({
      ...flow,
      arc: buildGreatCircleArc(originCoordinates, flow.coordinates, worldMapProjection)
    }));
  }
);

export const getHighlightedCountriesIso = createSelector(
  [getHighlightedCountryIds, getContexts],
  (highlightedCountryIds, contexts) => {
    if (!highlightedCountryIds || !highlightedCountryIds.level1) return null;
    const countryGeoIds = { level1: [], level2: [] };
    contexts.forEach(c => {
      if (highlightedCountryIds.level1?.includes(c.countryId)) {
        countryGeoIds.level1.push(c.worldMap.geoId);
      }
      if (highlightedCountryIds.level2?.includes(c.countryId)) {
        countryGeoIds.level2.push(c.worldMap.geoId);
      }
    });
    return countryGeoIds;
  }
);
