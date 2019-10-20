import { connect } from 'react-redux';
import { createNodesPanelActions } from 'react-components/nodes-panel/nodes-panel.actions';
import CountrySourcesPanel from './country-sources-panel.component';

const countriesActions = createNodesPanelActions('country');

const mapStateToProps = state => ({
  tabs: state.nodesPanel.sources.tabs,
  selectedCountry:
    state.nodesPanel.countries.selectedNodeId &&
    state.nodesPanel.countries.data.nodes[state.nodesPanel.countries.selectedNodeId],
  selectedSourcesIds: state.nodesPanel.sources.selectedNodesIds
});

const mapDispatchToProps = {
  setCountriesPage: countriesActions.setPage,
  fetchCountriesData: countriesActions.fetchData,
  setCountriesLoadingItems: countriesActions.setLoadingItems,
  onSelectCountry: countriesActions.setSelectedItem
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CountrySourcesPanel);
