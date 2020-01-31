import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import getTopNodesKey from 'utils/getTopNodesKey';
import { legacyExploreActions } from 'react-components/legacy-explore/legacy-explore.register';
import { appActions } from 'app/app.register';
import { getSelectedContext, getSelectedYears } from 'app/app.selectors';
import { getDestinationCountries } from 'react-components/legacy-explore/explore.selectors';
import Explore from './explore.component';

const mapStateToProps = state => {
  const selectedContext = getSelectedContext(state);
  const selectedYears = getSelectedYears(state);
  const { topNodes, selectedTableColumnType, loading: loadingDict } = state.legacyExplore;
  const topNodesKey = selectedContext
    ? getTopNodesKey(selectedContext.id, selectedTableColumnType, ...selectedYears)
    : null;
  const topExporters = topNodes[topNodesKey] || [];
  // set loading as true if the topNodesKey doesnt exist yet
  const loading = typeof loadingDict[topNodesKey] === 'undefined' || loadingDict[topNodesKey];
  const redirectQuery = state.location.query;
  const destinationCountries = getDestinationCountries(state);
  return {
    loading,
    topNodesKey,
    topExporters,
    selectedYears,
    redirectQuery,
    selectedContext,
    selectedTableColumnType,
    destinationCountries
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      selectContextById: appActions.selectContextById,
      setSelectedTableColumnType: legacyExploreActions.setSelectedTableColumnType,
      getTableElements: legacyExploreActions.setExploreTopNodes
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Explore);
