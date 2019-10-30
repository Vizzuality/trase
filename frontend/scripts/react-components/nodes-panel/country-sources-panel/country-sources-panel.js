import { connect } from 'react-redux';
import CountrySourcesPanel from './country-sources-panel.component';

function getSelectedCountry(state) {
  const {
    selectedNodeId,
    data: { nodes }
  } = state.nodesPanel.countries;
  return selectedNodeId && nodes && nodes[selectedNodeId];
}
const mapStateToProps = state => ({
  selectedCountry: getSelectedCountry(state),
  selectedSourcesIds: state.nodesPanel.sources.selectedNodesIds
});

export default connect(mapStateToProps)(CountrySourcesPanel);
