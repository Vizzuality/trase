import { connect } from 'react-redux';
import { createNodesPanelActions } from 'react-components/nodes-panel/nodes-panel.actions';
import { createNodesPanelSelectors } from 'react-components/nodes-panel/nodes-panel.selectors';
import CountriesPanel from './countries-panel.component';

const { fetchData, setLoadingItems, setSelectedItem } = createNodesPanelActions('countries');
const countriesProps = createNodesPanelSelectors('countries');

const mapDispatchToProps = {
  fetchData,
  setLoadingItems,
  setSelectedItem
};

export default connect(
  countriesProps,
  mapDispatchToProps
)(CountriesPanel);
