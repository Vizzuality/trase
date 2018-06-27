import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  getTopNodesKey,
  setExploreTopNodes,
  setSelectedTableColumn
} from 'react-components/explore/explore.actions';
import { selectContextById } from 'actions/app.actions';
import Explore from './explore.component';

const mapStateToProps = state => {
  const { selectedYears } = state.tool;
  const { selectedContext, contextIsUserSelected } = state.app;
  const { topNodes, selectedTableColumn } = state.explore;
  const topNodesKey = selectedContext
    ? getTopNodesKey(selectedContext.id, selectedTableColumn, ...selectedYears)
    : null;
  const topExporters = topNodes[topNodesKey] || [];
  const isSubnational = selectedContext ? selectedContext.isSubnational : null;

  return {
    topNodesKey,
    topExporters,
    isSubnational,
    selectedYears,
    selectedContext,
    selectedTableColumn,
    showTable: contextIsUserSelected
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      selectContextById,
      setSelectedTableColumn,
      getTableElements: setExploreTopNodes
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Explore);
