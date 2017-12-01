import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import groupBy from 'lodash/groupBy';
import Search from 'react-components/shared/search.component.js';
import { selectExpandedNode } from 'actions/tool.actions';
import { ACTORS_COLUMN_IDS, IMPORTER_EXPORTER_TYPE } from 'constants';

let searchNodes;

const mapStateToProps = (state) => {
  const { nodes, selectedNodesIds } = state.tool;
  // store nodes at container level to avoid rerendering when filtering... for want of a better solution
  if (nodes !== undefined && !searchNodes) {
    const allNodes = nodes.filter(
      node => node.hasFlows === true &&
      node.isAggregated !== true &&
      node.isUnknown !== true
    );

    searchNodes = Object.values(groupBy(allNodes.filter(x => ACTORS_COLUMN_IDS.includes(x.columnId)), 'mainNodeId'))
      .map(([nA, nB]) => nB ?
        ({
          id: `${nA.id}_${nB.id}`,
          name: nA.name,
          type: IMPORTER_EXPORTER_TYPE,
          selected: (selectedNodesIds.includes(nA.id) || selectedNodesIds.includes(nB.id)),
          [nA.type.toLowerCase()]: nA,
          [nB.type.toLowerCase()]: nB
        })
        : nA)
      .concat(allNodes.filter(x => !ACTORS_COLUMN_IDS.includes(x.columnId)));
  }
  return {
    nodes: searchNodes
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    onAddNode: nodeId => selectExpandedNode(nodeId)
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
