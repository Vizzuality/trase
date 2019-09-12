import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import getTopNodesKey from 'utils/getTopNodesKey';
import {
  setExploreTopNodes,
  setSelectedTableColumnType
} from 'react-components/legacy-explore/explore.actions';
import { selectContextById } from 'actions/app.actions';
import { getSelectedContext, getSelectedYears } from 'reducers/app.selectors';
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
