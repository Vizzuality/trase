import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import { useFirstItem } from 'react-components/shared/grid-list/grid-list.hooks';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import ResizeListener from 'react-components/shared/resize-listener.component';
import { BREAKPOINTS } from 'constants';

function DestinationsPanel(props) {
  const {
    page,
    setPage,
    loading,
    fetchData,
    fetchKey,
    previousSteps,
    destinations,
    searchResults,
    selectionMode,
    setSelectionMode,
    setSearchResult,
    getSearchResults,
    setSelectedItems,
    selectedNodesIds
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
          <div className="grid-container">
            <SearchInput
              variant="bordered"
              size="sm"
              className="dashboard-panel-search"
              items={searchResults}
              placeholder="Search place"
              onSelect={setSearchResult}
              onSearchTermChange={getSearchResults}
            />
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
              selectionMode={selectionMode}
              onSelectAllClick={setSelectionMode}
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
  selectionMode: PropTypes.bool,
  setSelectionMode: PropTypes.func
};

DestinationsPanel.defaultProps = {
  destinations: []
};

export default DestinationsPanel;
