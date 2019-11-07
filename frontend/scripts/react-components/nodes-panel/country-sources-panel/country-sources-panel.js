import { connect } from 'react-redux';
import CountrySourcesPanel from './country-sources-panel.component';

function getSelectedCountry(state) {
  const {
    draftSelectedNodeId,
    data: { nodes }
  } = state.nodesPanel.countries;
  return draftSelectedNodeId && nodes && nodes[draftSelectedNodeId];
}
const mapStateToProps = state => ({
  selectedCountry: getSelectedCountry(state),
  selectedSourcesIds: state.nodesPanel.sources.draftSelectedNodesIds
});

export default connect(mapStateToProps)(CountrySourcesPanel);
