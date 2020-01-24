import { connect } from 'react-redux';
import {
  setPage,
  fetchData,
  setSearchResult,
  getSearchResults,
  setLoadingItems,
  setSelectedItems,
  setSelectedTab,
  setExcludingMode,
  setOrderBy
} from 'react-components/nodes-panel/nodes-panel.register';
import { makeGetNodesPanelsProps } from 'react-components/nodes-panel/nodes-panel.selectors';
import DestinationsPanel from './destinations-panel.component';

const NAME = 'destinations';
const mapDispatchToProps = {
  setPage: page => setPage(page, NAME),
  fetchData: key => fetchData(key, NAME),
  setOrderBy: orderBy => setOrderBy(orderBy, NAME),
  setExcludingMode: mode => setExcludingMode(mode, NAME),
  setSelectedTab: activeTab => setSelectedTab(activeTab, NAME),
  setLoadingItems: loadingItems => setLoadingItems(loadingItems, NAME),
  setSearchResult: activeItem => setSearchResult(activeItem, NAME),
  getSearchResults: query => getSearchResults(query, NAME),
  setSelectedItems: activeItem => setSelectedItems(activeItem, NAME)
};

export default connect(
  makeGetNodesPanelsProps(NAME),
  mapDispatchToProps
)(DestinationsPanel);
