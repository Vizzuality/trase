import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import { useFirstItem } from 'react-components/shared/grid-list/grid-list.hooks';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import Tabs from 'react-components/shared/tabs/tabs.component';
import Text from 'react-components/shared/text';
import ResizeListener from 'react-components/shared/resize-listener.component';
import { BREAKPOINTS } from 'constants';

import './importers-panel.scss';

function ImportersPanel(props) {
  const {
    tabs,
    page,
    loading,
    searchResults,
    importers,
    setPage,
    setSearchResult,
    getSearchResults,
    nodeTypeRenderer,
    setSelectedItems,
    selectedNodesIds,
    setSelectedTab,
    activeTab,
    actionComponent,
    previousSteps,
    fetchData,
    fetchKey
  } = props;

  useEffect(() => {
    if (previousSteps !== fetchKey || fetchKey === null) {
      fetchData(previousSteps);
    }
  }, [previousSteps, fetchData, fetchKey]);

  const itemToScrollTo = useFirstItem(importers);

  if (!loading && !activeTab) {
    return (
      <div className="c-importers-panel">
        <Text size="lg" className="no-data" align="center">
          There is no data for importers for the current selection
        </Text>
      </div>
    );
  }

  return (
    <ResizeListener>
      {({ windowWidth }) => {
        const columnsCount = windowWidth > BREAKPOINTS.laptop ? 5 : 3;
        const width = windowWidth > BREAKPOINTS.laptop ? 950 : 560;
        return (
          <div className="c-importers-panel">
            <SearchInput
              variant="bordered"
              size="sm"
              className="importers-panel-search"
              items={searchResults}
              placeholder="Search importer"
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
                  className="importers-panel-pill-list"
                  items={importers}
                  height={importers.length > columnsCount ? 200 : 50}
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

ImportersPanel.propTypes = {
  fetchKey: PropTypes.string,
  previousSteps: PropTypes.string,
  importers: PropTypes.array,
  selectedNodesIds: PropTypes.array,
  page: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  setPage: PropTypes.func.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  nodeTypeRenderer: PropTypes.func.isRequired,
  tabs: PropTypes.array.isRequired,
  activeTab: PropTypes.number,
  setSelectedTab: PropTypes.func.isRequired,
  actionComponent: PropTypes.node,
  fetchData: PropTypes.func.isRequired
};

ImportersPanel.defaultProps = {
  importers: [],
  activeTab: null
};

export default ImportersPanel;
