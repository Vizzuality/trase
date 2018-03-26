import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';
import lineString from 'turf-linestring';
import memoize from 'lodash/memoize';
import WorldMap from 'react-components/shared/world-map/world-map.component';
import { COUNTRY_ID_ORIGIN } from 'scripts/countries';
import { setExploreTopNodes, getTopNodesKey } from 'react-components/explore/explore.actions';

const originCountries = Object.values(COUNTRY_ID_ORIGIN);

const getContextFlows = (countries, origin) => {
  const contextFlows = countries
    ? countries
        .filter(country => country.geoId !== origin.geoId)
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
  const originLeftOfBbox = origin.coordinates[0] < medianX;
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

const memoizedGetContextFlows = memoize(getContextFlows, (c, o, ctxId) => ctxId);

const mapStateToProps = state => {
  const { selectedContext, selectedContextId, selectedYears } = state.tool;
  const origin = selectedContext && COUNTRY_ID_ORIGIN[selectedContext.countryId];

  const topNodesKey = getTopNodesKey(selectedContextId, 8, ...selectedYears);
  const countries = state.explore.topNodes[topNodesKey];
  const flows =
    origin && countries ? memoizedGetContextFlows(countries, origin, selectedContextId) : [];

  return {
    flows,
    origin,
    selectedContext,
    selectedYears,
    originCountries
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getTopNodes: () => setExploreTopNodes(8)
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(WorldMap);
