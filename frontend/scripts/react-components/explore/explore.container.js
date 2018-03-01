// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Explore from 'react-components/explore/explore.component';
import turf from 'turf';
import { COUNTRIES_COORDINATES } from 'scripts/countries';

const origin = {
  coordinates: [-99.1351318359375, 19.37334071336406],
  geoId: 'MX'
};

const mapStateToProps = state => {
  const countries = state.tool.visibleNodesByColumn.find(c => c.columnId === 3);
  const flows = countries
    ? countries.values.slice(0, 10).map(country => ({
        ...country,
        coordinates: COUNTRIES_COORDINATES[country.geoId],
        strokeWidth: 5
      }))
    : [];
  const [minX, minY, maxX, maxY] = turf.bbox(turf.lineString(flows.map(f => f.coordinates)));
  const medianX = (maxX + minX) / 2;
  const isLeft = origin.coordinates[0] > medianX;
  const pointOfControl = isLeft ? maxX : minX;

  const newFlows = flows.map(flow => ({
    ...flow,
    curveStyle:
      flow.coordinates[0] > pointOfControl && flow.coordinates[0] > origin.coordinates[0]
        ? 'concave'
        : 'convex'
  }));
  return {
    flows: newFlows,
    origin
  };
};

export default connect(mapStateToProps)(Explore);
