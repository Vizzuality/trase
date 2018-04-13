import {
  selectExpandedNode,
  selectNode,
  setSankeySearchVisibility,
  setSearch
} from 'actions/tool.actions';
import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';
import ToolSearch from 'react-components/tool/tool-search/tool-search.component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import isNodeColumnVisible from 'utils/isNodeColumnVisible';

let searchNodes;

const getNode = (nodes, selectedColumnsIds, nodesDict) => {
  const [nA, nB] = nodes;
  if (nB) {
    if (
      isNodeColumnVisible(nodesDict[nA.id], selectedColumnsIds) &&
      isNodeColumnVisible(nodesDict[nB.id], selectedColumnsIds)
    ) {
      return {
        id: `${nA.id}_${nB.id}`,
        name: nA.name,
        type: `${nA.type} & ${nB.type}`,
        profileType: `${nA.type} & ${nB.type}`,
        [nA.type.toLowerCase()]: nA,
        [nB.type.toLowerCase()]: nB
      };
    }
    return nodes;
  }
  return nA;
};

const mapStateToProps = state => {
  const {
    nodes,
    selectedNodesIds,
    selectedColumnsIds,
    nodesDict,
    isSearchOpen,
    search
  } = state.tool;
  // store nodes at container level to avoid rerendering when filtering... for want of a better solution
  if (nodes !== undefined && (!searchNodes || nodes.length !== searchNodes.length)) {
    const allNodes = nodes.filter(
      node => node.hasFlows === true && node.isAggregated !== true && node.isUnknown !== true
    );
    searchNodes = flatten(
      Object.values(groupBy(allNodes, 'mainNodeId')).map(groupedNodes =>
        getNode(groupedNodes, selectedColumnsIds, nodesDict)
      )
    );
  }

  return {
    selectedNodesIds,
    isSearchOpen,
    nodes: searchNodes.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()))
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onAddNode: nodeId => selectExpandedNode(nodeId),
      onRemoveNode: nodeId => selectNode(nodeId),
      setSankeySearchVisibility: searchVisibility => setSankeySearchVisibility(searchVisibility),
      onInputValueChange: inputValue => setSearch(inputValue)
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ToolSearch);
