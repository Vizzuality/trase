import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import groupBy from 'lodash/groupBy';
import flatten from 'lodash/flatten';
import Search from 'react-components/shared/search.component.js';
import { selectExpandedNode, selectNode } from 'actions/tool.actions';
import isNodeColumnVisible from 'utils/isNodeColumnVisible';

let searchNodes;

const getNode = (nodes, selectedColumnsIds, nodesDict) => {
  const [nA, nB] = nodes;
  if (nB) {
    if (
      isNodeColumnVisible(nodesDict[nA.id], selectedColumnsIds) &&
      isNodeColumnVisible(nodesDict[nB.id], selectedColumnsIds)
    ) {
      return ({
        id: `${nA.id}_${nB.id}`,
        name: nA.name,
        type: `${nA.type} & ${nB.type}`,
        profileType: `${nA.type} & ${nB.type}`,
        [nA.type.toLowerCase()]: nA,
        [nB.type.toLowerCase()]: nB
      });
    } else {
      return nodes;
    }
  }
  return nA;
};

const mapStateToProps = (state) => {
  const { nodes, selectedNodesIds, selectedColumnsIds, nodesDict } = state.tool;
  // store nodes at container level to avoid rerendering when filtering... for want of a better solution
  if (nodes !== undefined && (!searchNodes || nodes.length !== searchNodes.length)) {
    const allNodes = nodes.filter(
      node => node.hasFlows === true &&
      node.isAggregated !== true &&
      node.isUnknown !== true
    );
    searchNodes = flatten(Object.values(groupBy(allNodes, 'mainNodeId'))
      .map((groupedNodes) => getNode(groupedNodes, selectedColumnsIds, nodesDict)));
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
