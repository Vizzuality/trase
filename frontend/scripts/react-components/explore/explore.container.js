import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  getTopNodesKey,
  setExploreTopNodes,
  setSelectedTableColumnType
} from 'react-components/explore/explore.actions';
import { selectContextById } from 'actions/app.actions';
import Explore from './explore.component';

const mapStateToProps = state => {
  const { selectedContext, selectedYears } = state.app;
  const { topNodes, selectedTableColumnType, loading: loadingDict } = state.explore;
  const topNodesKey = selectedContext
    ? getTopNodesKey(selectedContext.id, selectedTableColumnType, ...selectedYears)
    : null;
  const topExporters = topNodes[topNodesKey] || [];
  const loading = loadingDict[topNodesKey];
  const redirectQuery = state.location.query;

  return {
    loading,
    topNodesKey,
    topExporters,
    selectedYears,
    redirectQuery,
    selectedContext,
    selectedTableColumnType
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
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
