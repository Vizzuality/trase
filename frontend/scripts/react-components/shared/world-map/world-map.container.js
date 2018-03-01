// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import WorldMap from 'react-components/shared/world-map/world-map.component';
import turf from 'turf';

const origin = {
  coordinates: [-99.1351318359375, 19.37334071336406],
  geoId: 'MX'
};

const mapStateToProps = state => {
  const countries = state.worldMap.flows[state.tool.selectedContextId];
  const contextFlows = countries
    ? countries.map((country, index) => ({
        ...country,
        strokeWidth: index
      }))
    : [];
  const [minX,, maxX] = turf.bbox(turf.lineString(contextFlows.map(f => f.coordinates)));
  const medianX = (maxX + minX) / 2;
  const isLeft = origin.coordinates[0] > medianX;
  const pointOfControl = isLeft ? maxX : minX;

  const flows = contextFlows.map(flow => ({
    ...flow,
    curveStyle:
      flow.coordinates[0] > pointOfControl && flow.coordinates[0] > origin.coordinates[0]
        ? 'concave'
        : 'convex'
  }));
  return {
    flows,
    origin
  };
};

export default connect(mapStateToProps)(WorldMap);
