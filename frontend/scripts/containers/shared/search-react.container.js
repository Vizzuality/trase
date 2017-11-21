import { connect } from 'preact-redux';
import Search from 'react-components/shared/search.component.js';
import { searchNode } from 'actions/tool.actions';

let nodes;

const mapStateToProps = (state) => {
  // store nodes at container level to avoid rerendering when filtering... for want of a better solution
  if (state.tool.nodes !== undefined) {
    nodes = state.tool.nodes.filter(
      node => node.hasFlows === true &&
      node.isAggregated !== true &&
      node.isUnknown !== true
    );
  }
  return {
    nodes
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onNodeSelected: (nodeId) => {
      dispatch(searchNode(nodeId));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
