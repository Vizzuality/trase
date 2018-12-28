import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  getTopNodesKey,
  setExploreTopNodes,
  setSelectedTableColumnType
} from 'react-components/explore/explore.actions';
import { selectContextById, toggleDropdown } from 'actions/app.actions';
import Explore from './explore.component';

const mapStateToProps = state => {
  const { selectedYears } = state.tool;
  const { selectedContext, contextIsUserSelected } = state.app;
  const { topNodes, selectedTableColumnType, loading: loadingDict } = state.explore;
  const topNodesKey = selectedContext
    ? getTopNodesKey(selectedContext.id, selectedTableColumnType, ...selectedYears)
    : null;
  const topExporters = topNodes[topNodesKey] || [];
  const isSubnational = selectedContext ? selectedContext.isSubnational : null;
  const loading = loadingDict[topNodesKey];
  return {
    loading,
    topNodesKey,
    topExporters,
    isSubnational,
    selectedYears,
    selectedContext,
    selectedTableColumnType,
    showTable: contextIsUserSelected,
    currentDropdown: state.app.currentDropdown
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleDropdown,
      selectContextById,
      setSelectedTableColumnType,
      getTableElements: setExploreTopNodes
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Explore);
