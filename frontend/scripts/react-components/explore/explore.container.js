import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getTopNodesKey, setExploreTopNodes } from 'react-components/explore/explore.actions';
import Explore from './explore.component';

const mapStateToProps = state => {
  const { selectedContextId, selectedYears } = state.tool;
  const { topNodes } = state.explore;
  const topNodesKey = getTopNodesKey(selectedContextId, 6, ...selectedYears);
  const topExporters = topNodes[topNodesKey] || [];
  return {
    topExporters,
    year: selectedYears[0],
    showTable: selectedContextId !== null
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getTopExporters: () => setExploreTopNodes(6)
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Explore);
