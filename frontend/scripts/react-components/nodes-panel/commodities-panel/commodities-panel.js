import { connect } from 'react-redux';
import { createNodesPanelSelectors } from 'react-components/nodes-panel/nodes-panel.selectors';
import { createNodesPanelActions } from 'react-components/nodes-panel/nodes-panel.actions';
import CommoditiesPanel from './commodities-panel.component';

const { fetchData, setLoadingItems, setSelectedItem, setPage } = createNodesPanelActions(
  'commodities'
);
const commoditiesSelectors = createNodesPanelSelectors('commodities');

const mapStateToProps = state => {
  const { commodities, page, loading, selectedNodeId } = commoditiesSelectors(state);
  return {
    commodities,
    page,
    loading,
    selectedNodeId
  };
};

const mapDispatchToProps = {
  setPage,
  fetchData,
  setLoadingItems,
  setSelectedItem
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommoditiesPanel);
