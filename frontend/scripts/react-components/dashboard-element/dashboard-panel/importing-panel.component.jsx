import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item.component';

function ImportingPanel(props) {
  const { searchDestinations, destinations, activeDestinationId, onSelectDestinationValue } = props;

  return (
    <React.Fragment>
      <SearchInput
        className="dashboard-panel-search"
        items={searchDestinations}
        placeholder="Search place"
        onSelect={i => i}
      />
      <GridList
        items={destinations}
        height={200}
        width={950}
        rowHeight={50}
        columnWidth={190}
        columnCount={5}
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

ImportingPanel.propTypes = {
  destinations: PropTypes.array,
  searchDestinations: PropTypes.array,
  activeDestinationId: PropTypes.string,
  onSelectDestinationValue: PropTypes.func.isRequired
};

export default ImportingPanel;
