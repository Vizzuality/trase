import { connect } from 'preact-redux';
import Search from 'react-components/shared/search.component.js';

const mapStateToProps = (state) => {
  return {
    nodes: state.tool.nodesDict
  };
};

export default connect(
  mapStateToProps
)(Search);

// return _.values(state.tool.nodesDict)
//   .filter(
//     node => node.hasFlows === true &&
//     node.isAggregated !== true &&
//     node.isUnknown !== true
//   );
