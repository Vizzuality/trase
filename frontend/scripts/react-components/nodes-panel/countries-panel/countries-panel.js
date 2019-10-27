import { connect } from 'react-redux';
import {
  fetchData,
  setLoadingItems,
  setSelectedItem
} from 'react-components/nodes-panel/nodes-panel.actions';
import { makeGetNodesPanelsProps } from 'react-components/nodes-panel/nodes-panel.selectors';
import CountriesPanel from './countries-panel.component';

const NAME = 'countries';
const mapDispatchToProps = {
  fetchData: key => fetchData(key, NAME),
  setLoadingItems: loadingItems => setLoadingItems(loadingItems, NAME),
  setSelectedItem: activeItem => setSelectedItem(activeItem, NAME)
};

export default connect(
  makeGetNodesPanelsProps(NAME),
  mapDispatchToProps
)(CountriesPanel);
