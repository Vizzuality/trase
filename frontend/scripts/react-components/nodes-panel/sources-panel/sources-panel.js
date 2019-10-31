import { connect } from 'react-redux';
import {
  setPage,
  fetchData,
  setSelectionMode,
  setLoadingItems,
  setSelectedItems,
  setSelectedTab,
  getSearchResults,
  setSearchResult
} from 'react-components/nodes-panel/nodes-panel.actions';
import { makeGetNodesPanelsProps } from 'react-components/nodes-panel/nodes-panel.selectors';
import SourcesPanel from './sources-panel.component';

const NAME = 'sources';
const mapDispatchToProps = {
  setPage: page => setPage(page, NAME),
  fetchData: key => fetchData(key, NAME),
  setSelectionMode: mode => setSelectionMode(mode, NAME),
  setSelectedTab: activeTab => setSelectedTab(activeTab, NAME),
  setLoadingItems: loadingItems => setLoadingItems(loadingItems, NAME),
  setSearchResult: activeItem => setSearchResult(activeItem, NAME),
  getSearchResults: query => getSearchResults(query, NAME),
  setSelectedItems: activeItem => setSelectedItems(activeItem, NAME)
};

export default connect(
  makeGetNodesPanelsProps(NAME),
  mapDispatchToProps
)(SourcesPanel);
