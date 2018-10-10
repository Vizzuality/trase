import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';
import lineString from 'turf-linestring';
import memoize from 'lodash/memoize';
import WorldMap from 'react-components/shared/world-map/world-map.component';
import { COUNTRIES_COORDINATES } from 'scripts/countries';
import { setExploreTopNodes, getTopNodesKey } from 'react-components/explore/explore.actions';
import uniqBy from 'lodash/uniqBy';
import compact from 'lodash/compact';

const getContextFlows = (countries, origin, originGeoId, originCoordinates) => {
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
  const [minX, , maxX] = bbox(lineString(contextFlows.map(f => f.coordinates)));
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

  return contextFlows.map(destination => ({
    ...destination,
    curveStyle: getCurveStyle(destination.coordinates)
  }));
};

const memoizedGetContextFlows = memoize(getContextFlows, (c, ogi, oc, ctxId, start, end) =>
  [ctxId, start, end].join('_')
);

const mapStateToProps = state => {
  const pageType = state.location.type;
  const { selectedYears } = state.tool;
  const { selectedContext, contextIsUserSelected, contexts } = state.app;

  const originGeoId =
    contextIsUserSelected && selectedContext ? selectedContext.worldMap.geoId : null;
  const originCoordinates =
    contextIsUserSelected && selectedContext && originGeoId
      ? COUNTRIES_COORDINATES[originGeoId]
      : null;

  const originCountries = uniqBy(contexts, context => context.worldMap.geoId).map(context => ({
    name: context.countryName,
    annotationPos: compact([
      context.worldMap.annotationPositionXPos,
      context.worldMap.annotationPositionYPos
    ]),
    geoId: context.worldMap.geoId,
    coordinates: COUNTRIES_COORDINATES[context.worldMap.geoId]
  }));

  const selectedContextId = selectedContext ? selectedContext.id : null;

  const topNodesKey = getTopNodesKey(selectedContextId, 'country', ...selectedYears);
  const countries = state.explore.topNodes[topNodesKey];

  const flows =
    originGeoId && originCoordinates && countries
      ? memoizedGetContextFlows(
          countries,
          originGeoId,
          originCoordinates,
          selectedContextId,
          ...selectedYears
        )
      : [];

  return {
    renderFlows: contextIsUserSelected || pageType !== 'explore',
    flows,
    originGeoId,
    originCoordinates,
    selectedContext,
    selectedYears,
    originCountries
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getTopNodes: () => setExploreTopNodes('country')
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorldMap);
