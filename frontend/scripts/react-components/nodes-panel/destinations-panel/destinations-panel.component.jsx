import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import { useFirstItem } from 'react-components/shared/grid-list/grid-list.hooks';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import ResizeListener from 'react-components/shared/resize-listener.component';
import { BREAKPOINTS } from 'constants';
import OrderBy from 'react-components/nodes-panel/order-by.component';
import Tabs from 'react-components/shared/tabs/tabs.component';

import './destinations-panel.scss';

function DestinationsPanel(props) {
  const {
    page,
    setPage,
    loading,
    fetchData,
    fetchKey,
    orderBy,
    setOrderBy,
    previousSteps,
    destinations,
    searchResults,
    excludingMode,
    setExcludingMode,
    setSearchResult,
    getSearchResults,
    setSelectedItems,
    selectedNodesIds,
    tabs,
    activeTab,
    setSelectedTab
  } = props;

  useEffect(() => {
    if (previousSteps !== fetchKey || fetchKey === null) {
      fetchData(previousSteps);
    }
  }, [previousSteps, fetchData, fetchKey]);

  const itemToScrollTo = useFirstItem(destinations);

  return (
    <ResizeListener>
      {({ windowWidth }) => {
        const columnsCount = windowWidth > BREAKPOINTS.laptop ? 5 : 3;
        const width = windowWidth > BREAKPOINTS.laptop ? 950 : 560;
        return (
          <div className="c-destinations-panel">
            <div className="destinations-panel-actions-container">
              <SearchInput
                variant="bordered"
                size="sm"
                className="dashboard-panel-search"
                items={searchResults}
                placeholder="Search place"
                onSelect={setSearchResult}
                onSearchTermChange={getSearchResults}
              />
            </div>
            <Tabs
              tabs={tabs}
              onSelectTab={setSelectedTab}
              selectedTab={activeTab}
              itemTabRenderer={i => i.name}
              getTabId={item => item.id}
              actionComponent={<OrderBy orderBy={orderBy} setOrderBy={setOrderBy} />}
            >
              {activeTab && (
                <GridList
                  className="dashboard-panel-pill-list"
                  items={destinations}
                  height={200}
                  width={width}
                  rowHeight={50}
                  columnWidth={190}
                  columnCount={columnsCount}
                  page={page}
                  getMoreItems={setPage}
                  loading={loading}
                  itemToScrollTo={itemToScrollTo}
                  excludingMode={ENABLE_TOOL_PANEL ? excludingMode : undefined}
                  onSelectAllClick={ENABLE_TOOL_PANEL ? setExcludingMode : undefined}
                >
                  {itemProps => (
                    <GridListItem
                      {...itemProps}
                      isActive={selectedNodesIds.includes(itemProps.item?.id)}
                      enableItem={setSelectedItems}
                      disableItem={setSelectedItems}
                    />
                  )}
                </GridList>
              )}
            </Tabs>
          </div>
        );
      }}
    </ResizeListener>
  );
}

DestinationsPanel.propTypes = {
  fetchKey: PropTypes.string,
  previousSteps: PropTypes.string,
  destinations: PropTypes.array,
  page: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  searchResults: PropTypes.array,
  selectedNodesIds: PropTypes.array,
  setPage: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
  excludingMode: PropTypes.bool,
  setExcludingMode: PropTypes.func,
  setOrderBy: PropTypes.func,
  orderBy: PropTypes.object,
  tabs: PropTypes.array,
  activeTab: PropTypes.object,
  setSelectedTab: PropTypes.func
};

DestinationsPanel.defaultProps = {
  destinations: []
};

export default DestinationsPanel;
