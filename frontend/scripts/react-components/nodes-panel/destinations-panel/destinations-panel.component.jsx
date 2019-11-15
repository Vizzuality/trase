import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import { useFirstItem } from 'react-components/shared/grid-list/grid-list.hooks';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import ResizeListener from 'react-components/shared/resize-listener.component';
import { BREAKPOINTS } from 'constants';
import OrderBy from 'react-components/nodes-panel/order-by.component';

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
    draftPreviousSteps,
    destinations,
    searchResults,
    excludingMode,
    setExcludingMode,
    setSearchResult,
    getSearchResults,
    setSelectedItems,
    selectedNodesIds
  } = props;

  useEffect(() => {
    if (draftPreviousSteps !== fetchKey || fetchKey === null) {
      fetchData(draftPreviousSteps);
    }
  }, [draftPreviousSteps, fetchData, fetchKey]);

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
              <OrderBy orderBy={orderBy} setOrderBy={setOrderBy} />
            </div>
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
              excludingMode={ENABLE_REDESIGN_PAGES ? excludingMode : undefined}
              onSelectAllClick={ENABLE_REDESIGN_PAGES ? setExcludingMode : undefined}
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
          </div>
        );
      }}
    </ResizeListener>
  );
}

DestinationsPanel.propTypes = {
  fetchKey: PropTypes.string,
  draftPreviousSteps: PropTypes.string,
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
  orderBy: PropTypes.object
};

DestinationsPanel.defaultProps = {
  destinations: []
};

export default DestinationsPanel;
