import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  getTopNodesKey,
  setExploreTopNodes,
  setSelectedTableColumn
} from 'react-components/explore/explore.actions';
import { selectContext } from 'actions/tool.actions';
import Explore from './explore.component';

const mapStateToProps = state => {
  const { selectedContextId, selectedContext, selectedYears } = state.tool;
  const { topNodes, selectedTableColumn } = state.explore;
  const topNodesKey = getTopNodesKey(selectedContextId, selectedTableColumn, ...selectedYears);
  const topExporters = topNodes[topNodesKey] || [];
  const { isSubnational } = selectedContext || {};

  return {
    topNodesKey,
    topExporters,
    isSubnational,
    selectedYears,
    selectedContextId,
    selectedTableColumn,
    showTable: selectedContextId !== null
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      selectContext,
      setSelectedTableColumn,
      getTableElements: setExploreTopNodes
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Explore);
