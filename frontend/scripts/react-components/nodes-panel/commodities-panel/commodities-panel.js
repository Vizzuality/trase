import { connect } from 'react-redux';
import { nodesPanelActions } from 'react-components/nodes-panel/nodes-panel.register';
import { makeGetNodesPanelsProps } from 'react-components/nodes-panel/nodes-panel.selectors';
import CommoditiesPanel from './commodities-panel.component';

const NAME = 'commodities';
const mapDispatchToProps = {
  setPage: page => nodesPanelActions.setPage(page, NAME),
  fetchData: key => nodesPanelActions.fetchData(key, NAME),
  setLoadingItems: loadingItems => nodesPanelActions.setLoadingItems(loadingItems, NAME),
  setSelectedItem: activeItem => nodesPanelActions.setSelectedItem(activeItem, NAME)
};

export default connect(makeGetNodesPanelsProps(NAME), mapDispatchToProps)(CommoditiesPanel);
