import { connect } from 'react-redux';
import {
  setPage,
  fetchData,
  setOrderBy,
  setLoadingItems,
  setSelectedItems,
  setSelectedTab,
  getSearchResults,
  setSearchResult,
  setExcludingMode
} from 'react-components/nodes-panel/nodes-panel.actions';
import { makeGetNodesPanelsProps } from 'react-components/nodes-panel/nodes-panel.selectors';
import ImportersPanel from './importers-panel.component';

const NAME = 'importers';
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
)(ImportersPanel);
