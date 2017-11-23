import { connect } from 'preact-redux';
import groupBy from 'lodash/groupBy';
import Search from 'react-components/shared/search.component.js';
import { searchNode } from 'actions/tool.actions';
import { ACTORS_COLUMN_IDS } from 'constants';

let nodes;

const mapStateToProps = (state) => {
  // store nodes at container level to avoid rerendering when filtering... for want of a better solution
  if (state.tool.nodes !== undefined && !nodes) {
    const allNodes = state.tool.nodes.filter(
      node => node.hasFlows === true &&
      node.isAggregated !== true &&
      node.isUnknown !== true
    );

    nodes = Object.values(groupBy(allNodes.filter(x => ACTORS_COLUMN_IDS.includes(x.columnId)), 'mainNodeId'))
      .map(([nA, nB]) => nB ?
        ({
          id: `${nA.id}_${nB.id}`,
          name: nA.name,
          type: 'IMPORTER & EXPORTER',
          [nA.type.toLowerCase()]: nA,
          [nB.type.toLowerCase()]: nB
        })
        : nA)
      .concat(allNodes.filter(x => !ACTORS_COLUMN_IDS.includes(x.columnId)));
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
