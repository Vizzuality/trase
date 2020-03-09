import { connect } from 'react-redux';
import { nodesPanelActions } from 'react-components/nodes-panel/nodes-panel.register';
import { makeGetNodesPanelsProps } from 'react-components/nodes-panel/nodes-panel.selectors';
import CountriesPanel from './countries-panel.component';

const NAME = 'countries';
const mapDispatchToProps = {
  fetchData: key => nodesPanelActions.fetchData(key, NAME),
  setLoadingItems: loadingItems => nodesPanelActions.setLoadingItems(loadingItems, NAME),
  setSelectedItem: activeItem => nodesPanelActions.setSelectedItem(activeItem, NAME)
};

export default connect(makeGetNodesPanelsProps(NAME), mapDispatchToProps)(CountriesPanel);
