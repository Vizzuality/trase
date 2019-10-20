import { connect } from 'react-redux';
import { createNodesPanelActions } from 'react-components/nodes-panel/nodes-panel.actions';
import CommoditiesPanel from './commodities-panel.component';

const { fetchData, setLoadingItems, setSelectedItem } = createNodesPanelActions('commodities');

const mapStateToProps = state => ({
  commodities: state.nodesPanel.commodities.data.byId.map(
    id => state.nodesPanel.commodities.data.nodes[id]
  ),
  page: state.nodesPanel.commodities.page,
  loading: state.nodesPanel.commodities.loadingItems,
  selectedNodeId: state.nodesPanel.commodities.selectedNodeId
});

const mapDispatchToProps = {
  fetchData,
  setLoadingItems,
  onSelectCommodity: setSelectedItem
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommoditiesPanel);
