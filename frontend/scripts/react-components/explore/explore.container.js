// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Explore from 'react-components/explore/explore.component';

const mapStateToProps = state => {
  const countries = state.tool.visibleNodesByColumn.find(c => c.columnId === 3);
  const flows = countries
    ? countries.values.slice(0, 10).map((country, i) => ({
        ...country,
        coordinates: [
          parseFloat(`${i % 2 === 0 ? '-' : ''}1${i}.${i * 4}`, 10),
          parseFloat(`${i % 2 === 0 ? '' : '-'}4${i}.${i * 3}`, 10)
        ],
        curveStyle: 'concave',
        strokeWidth: 1
      }))
    : [];

  return {
    flows
  };
};

export default connect(mapStateToProps)(Explore);
