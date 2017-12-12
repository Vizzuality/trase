import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import groupBy from 'lodash/groupBy';
import Search from 'react-components/shared/search.component.js';
import { selectExpandedNode, selectNode } from 'actions/tool.actions';

let searchNodes;

const mapStateToProps = (state) => {
  const { nodes, selectedNodesIds } = state.tool;
  // store nodes at container level to avoid rerendering when filtering... for want of a better solution
  if (nodes !== undefined && (!searchNodes || nodes.length !== searchNodes.length)) {
    const allNodes = nodes.filter(
      node => node.hasFlows === true &&
      node.isAggregated !== true &&
      node.isUnknown !== true
    );
    searchNodes = Object.values(groupBy(allNodes, 'mainNodeId'))
      .map(([nA, nB]) => nB ?
        ({
          id: `${nA.id}_${nB.id}`,
          name: nA.name,
          type: `${nA.type} & ${nB.type}`,
          profileType: `${nA.type} & ${nB.type}`,
          [nA.type.toLowerCase()]: nA,
          [nB.type.toLowerCase()]: nB
        })
        : nA);
  }

  return {
    selectedNodesIds,
    nodes: searchNodes
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    onAddNode: nodeId => selectExpandedNode(nodeId),
    onRemoveNode: nodeId => selectNode(nodeId)
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
