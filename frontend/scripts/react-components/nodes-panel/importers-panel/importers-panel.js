import { connect } from 'react-redux';
import { nodesPanelActions } from 'react-components/nodes-panel/nodes-panel.register';
import { makeGetNodesPanelsProps } from 'react-components/nodes-panel/nodes-panel.selectors';
import ImportersPanel from './importers-panel.component';

const NAME = 'importers';
const mapDispatchToProps = {
  setPage: page => nodesPanelActions.setPage(page, NAME),
  fetchData: key => nodesPanelActions.fetchData(key, NAME),
  setOrderBy: orderBy => nodesPanelActions.setOrderBy(orderBy, NAME),
  setExcludingMode: mode => nodesPanelActions.setExcludingMode(mode, NAME),
  setSelectedTab: activeTab => nodesPanelActions.setSelectedTab(activeTab, NAME),
  setLoadingItems: loadingItems => nodesPanelActions.setLoadingItems(loadingItems, NAME),
  setSearchResult: activeItem => nodesPanelActions.setSearchResult(activeItem, NAME),
  getSearchResults: query => nodesPanelActions.getSearchResults(query, NAME),
  setSelectedItems: activeItem => nodesPanelActions.setSelectedItems(activeItem, NAME)
};

export default connect(makeGetNodesPanelsProps(NAME), mapDispatchToProps)(ImportersPanel);
