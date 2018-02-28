// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Explore from 'react-components/explore/explore.component';
import turf from 'turf';

const origin = {
  coordinates: [-1, 55],
  iso: 'MX'
};

const mapStateToProps = state => {
  const countries = state.tool.visibleNodesByColumn.find(c => c.columnId === 3);
  const flows = countries
    ? countries.values.slice(0, 10).map((country, i) => ({
        ...country,
        coordinates: [
          parseFloat(`${i % 2 === 0 ? '-' : ''}1${i}.${i * 4}`, 10),
          parseFloat(`${i % 2 === 0 ? '' : '-'}4${i}.${i * 3}`, 10)
        ],
        strokeWidth: 1
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
    flows: newFlows
  };
};

export default connect(mapStateToProps)(Explore);
