import { connect } from 'react-redux';
import {
  setPage,
  fetchData,
  setLoadingItems,
  setSelectedItems,
  setSelectedTab,
  getSearchResults,
  setSearchResult,
  setSelectionMode
} from 'react-components/nodes-panel/nodes-panel.actions';
import { makeGetNodesPanelsProps } from 'react-components/nodes-panel/nodes-panel.selectors';
import ExportersPanel from './exporters-panel.component';

const NAME = 'exporters';
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
)(ExportersPanel);
