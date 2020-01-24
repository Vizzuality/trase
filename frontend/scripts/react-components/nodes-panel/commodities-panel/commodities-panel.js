import { connect } from 'react-redux';
import {
  fetchData,
  setLoadingItems,
  setSelectedItem,
  setPage
} from 'react-components/nodes-panel/nodes-panel.register';
import { makeGetNodesPanelsProps } from 'react-components/nodes-panel/nodes-panel.selectors';
import CommoditiesPanel from './commodities-panel.component';

const NAME = 'commodities';
const mapDispatchToProps = {
  setPage: page => setPage(page, NAME),
  fetchData: key => fetchData(key, NAME),
  setLoadingItems: loadingItems => setLoadingItems(loadingItems, NAME),
  setSelectedItem: activeItem => setSelectedItem(activeItem, NAME)
};

export default connect(
  makeGetNodesPanelsProps(NAME),
  mapDispatchToProps
)(CommoditiesPanel);
