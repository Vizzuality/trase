import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item.component';

function DestinationsPanel(props) {
  const {
    page,
    searchDestinations,
    destinations,
    activeDestinationId,
    onSelectDestinationValue,
    getMoreItems
  } = props;
  return (
    <React.Fragment>
      <SearchInput
        className="dashboard-panel-search"
        items={searchDestinations}
        placeholder="Search place"
        onSelect={i => i}
        onSearchTermChange={i => i}
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
      >
        {itemProps => (
          <GridListItem
            {...itemProps}
            isActive={activeDestinationId === (itemProps.item && itemProps.item.id)}
            enableItem={onSelectDestinationValue}
            disableItem={() => onSelectDestinationValue(null)}
          />
        )}
      </GridList>
    </React.Fragment>
  );
}

DestinationsPanel.propTypes = {
  destinations: PropTypes.array,
  page: PropTypes.number.isRequired,
  searchDestinations: PropTypes.array,
  activeDestinationId: PropTypes.string,
  getMoreItems: PropTypes.func.isRequired,
  onSelectDestinationValue: PropTypes.func.isRequired
};

export default DestinationsPanel;
