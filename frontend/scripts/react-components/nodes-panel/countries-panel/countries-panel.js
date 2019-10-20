import { connect } from 'react-redux';
import { createNodesPanelActions } from 'react-components/nodes-panel/nodes-panel.actions';
import { createNodesPanelSelectors } from 'react-components/nodes-panel/nodes-panel.selectors';
import CountriesPanel from './countries-panel.component';

const { fetchData, setLoadingItems, setSelectedItem } = createNodesPanelActions('countries');

const mapStateToProps = state => {
  const { countries, page, loading, selectedNodeId } = createNodesPanelSelectors('countries')(
    state
  );
  return {
    countries,
    page,
    loading,
    selectedCountryId: selectedNodeId
  };
};

const mapDispatchToProps = {
  fetchData,
  setLoadingItems,
  onSelectCountry: setSelectedItem
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CountriesPanel);
