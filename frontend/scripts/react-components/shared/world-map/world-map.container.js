import React from 'react';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';
import lineString from 'turf-linestring';
import memoize from 'lodash/memoize';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import WorldMap from 'react-components/shared/world-map/world-map.component';
import { COUNTRY_ID_ORIGIN, COUNTRIES_COORDINATES } from 'scripts/countries';

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

const memoizedGetContextFlows = memoize(getContextFlows, (c, o, ctxId, start, end) =>
  [ctxId, start, end].join('_')
);

const mapStateToProps = state => {
  const pageType = state.location.type;
  const { selectedYears } = state.tool;
  const { selectedContext, contextIsUserSelected } = state.app;
  const origin = selectedContext && COUNTRY_ID_ORIGIN[selectedContext.countryId];

  return {
    renderFlows: contextIsUserSelected || pageType !== 'explore',
    origin,
    selectedContext,
    selectedYears,
    originCountries
  };
};

const TOP_NODES = gql`
  query($ctx: Int!, $start: Int!, $end: Int!, $col: Int!) {
    nodes(ctx: $ctx, start: $start, end: $end, col: $col)
      @rest(
        type: "TopNodes"
        path: "/contexts/:ctx/top_nodes?start_year=:start&end_year=:end&column_id=:col"
      ) {
      data
    }
  }
`;

class WorldMapContainer extends React.Component {
  render() {
    const { origin, selectedContext, selectedYears, renderFlows } = this.props;
    if (!selectedContext) return null;

    const params = {
      start: selectedYears[0],
      end: selectedYears[1],
      col: 8,
      ctx: selectedContext.id
    };
    return (
      <Query query={TOP_NODES} variables={params}>
        {({ data: { nodes }, loading }) => {
          const topNodes =
            !loading &&
            nodes &&
            nodes.data &&
            nodes.data.targetNodes.map(row => ({
              ...row,
              geoId: row.geo_id,
              coordinates: COUNTRIES_COORDINATES[row.geo_id],
              name: row.name === selectedContext.countryName ? 'DOMESTIC CONSUMPTION' : row.name
            }));
          const flows =
            origin && topNodes
              ? memoizedGetContextFlows(topNodes, origin, selectedContext.id, ...selectedYears)
              : [];

          return <WorldMap {...this.props} renderFlows={renderFlows} flows={flows} />;
        }}
      </Query>
    );
  }
}

export default connect(mapStateToProps)(WorldMapContainer);
