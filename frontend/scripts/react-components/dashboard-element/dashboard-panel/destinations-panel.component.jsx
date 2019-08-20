import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import { useFirstItem } from 'react-components/shared/grid-list/grid-list.hooks';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';

function DestinationsPanel(props) {
  const {
    page,
    setSearchResult,
    searchDestinations,
    destinations,
    loading,
    getSearchResults,
    activeDestinations,
    onSelectDestinationValue,
    getMoreItems
  } = props;

  const itemToScrollTo = useFirstItem(destinations);

  return (
    <React.Fragment>
      <SearchInput
        variant="bordered"
        size="sm"
        className="dashboard-panel-search"
        items={searchDestinations}
        placeholder="Search place"
        onSelect={setSearchResult}
        onSearchTermChange={getSearchResults}
      />
      <GridList
        className="dashboard-panel-pill-list"
        items={destinations}
        height={200}
        width={950}
        rowHeight={50}
        columnWidth={190}
        columnCount={5}
        page={page}
        getMoreItems={getMoreItems}
        loading={loading}
        itemToScrollTo={itemToScrollTo}
      >
        {itemProps => (
          <GridListItem
            {...itemProps}
            isActive={activeDestinations.includes(itemProps.item?.id)}
            enableItem={onSelectDestinationValue}
            disableItem={onSelectDestinationValue}
          />
        )}
      </GridList>
    </React.Fragment>
  );
}

DestinationsPanel.propTypes = {
  destinations: PropTypes.array,
  page: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  searchDestinations: PropTypes.array,
  activeDestinations: PropTypes.array,
  getMoreItems: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  onSelectDestinationValue: PropTypes.func.isRequired
};

DestinationsPanel.defaultProps = {
  destinations: []
};

export default DestinationsPanel;
