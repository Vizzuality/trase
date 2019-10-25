import { connect } from 'react-redux';
import { createNodesPanelSelectors } from 'react-components/nodes-panel/nodes-panel.selectors';
import { createNodesPanelActions } from 'react-components/nodes-panel/nodes-panel.actions';
import CommoditiesPanel from './commodities-panel.component';

const { fetchData, setLoadingItems, setSelectedItem, setPage } = createNodesPanelActions(
  'commodities'
);
const commoditiesProps = createNodesPanelSelectors('commodities');

const mapDispatchToProps = {
  setPage,
  fetchData,
  setLoadingItems,
  setSelectedItem
};

export default connect(
  commoditiesProps,
  mapDispatchToProps
)(CommoditiesPanel);
