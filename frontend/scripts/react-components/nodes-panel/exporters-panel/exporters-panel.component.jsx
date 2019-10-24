import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import { useFirstItem } from 'react-components/shared/grid-list/grid-list.hooks';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import Tabs from 'react-components/shared/tabs/tabs.component';
import ResizeListener from 'react-components/shared/resize-listener.component';
import { BREAKPOINTS } from 'constants';

import './exporters-panel.scss';

function ExportersPanel(props) {
  const {
    tabs,
    page,
    loading,
    searchResults,
    exporters,
    setPage,
    setSearchResult,
    getSearchResults,
    nodeTypeRenderer,
    setSelectedIds,
    selectedNodesIds,
    setSelectedTab,
    activeTab,
    actionComponent,
    previousSteps,
    fetchData
  } = props;

  useEffect(() => {
    fetchData();
  }, [previousSteps, fetchData]);

  const itemToScrollTo = useFirstItem(exporters);

  return (
    <ResizeListener>
      {({ windowWidth }) => {
        const columnsCount = windowWidth > BREAKPOINTS.laptop ? 5 : 3;
        const width = windowWidth > BREAKPOINTS.laptop ? 950 : 560;
        return (
          <div className="c-exporters-panel">
            <SearchInput
              variant="bordered"
              size="sm"
              className="exporters-panel-search"
              items={searchResults}
              placeholder="Search exporter"
              onSelect={setSearchResult}
              nodeTypeRenderer={nodeTypeRenderer}
              onSearchTermChange={getSearchResults}
            />
            <Tabs
              tabs={tabs}
              onSelectTab={setSelectedTab}
              selectedTab={activeTab}
              itemTabRenderer={i => i.name}
              getTabId={item => item.id}
              actionComponent={actionComponent}
            >
              {activeTab && (
                <GridList
                  className="exporters-panel-pill-list"
                  items={exporters}
                  height={exporters.length > columnsCount ? 200 : 50}
                  width={width}
                  rowHeight={50}
                  columnWidth={190}
                  columnCount={columnsCount}
                  getMoreItems={setPage}
                  page={page}
                  loading={loading}
                  itemToScrollTo={itemToScrollTo}
                >
                  {itemProps => (
                    <GridListItem
                      {...itemProps}
                      isActive={selectedNodesIds.includes(itemProps.item?.id)}
                      enableItem={setSelectedIds}
                      disableItem={setSelectedIds}
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

ExportersPanel.propTypes = {
  exporters: PropTypes.array,
  selectedNodesIds: PropTypes.array,
  page: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  setPage: PropTypes.func.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  setSelectedIds: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  nodeTypeRenderer: PropTypes.func.isRequired,
  tabs: PropTypes.array.isRequired,
  activeTab: PropTypes.number,
  setSelectedTab: PropTypes.func.isRequired,
  actionComponent: PropTypes.node
};

ExportersPanel.defaultProps = {
  exporters: [],
  activeTab: null
};

export default ExportersPanel;
