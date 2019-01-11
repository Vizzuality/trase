import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading/heading.component';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';

import 'react-components/logistics-map/logistics-map-panel/logistics-map-panel.scss';
import Button from 'react-components/shared/button/button.component';

function LogisticsMapPanel(props) {
  const {
    items,
    enableItem,
    disableItem,
    filterItems,
    searchResults,
    activeItems,
    goToMap
  } = props;
  return (
    <div className="c-logistics-map-panel">
      <Heading align="center">Choose the options you want to see</Heading>
      <SearchInput
        size="sm"
        variant="secondary"
        items={searchResults}
        placeholder="Search company"
        onSelect={enableItem}
        nodeTypeRenderer={LogisticsMapPanel.nodeTypeRenderer}
        onSearchTermChange={filterItems}
      />
      <GridList
        items={items}
        width={760}
        height={200}
        rowHeight={50}
        columnWidth={190}
        columnCount={4}
      >
        {itemProps => (
          <GridListItem
            {...itemProps}
            isActive={activeItems.includes(itemProps.item && itemProps.item.name)}
            enableItem={enableItem}
            disableItem={disableItem}
          />
        )}
      </GridList>
      <div className="logistics-map-panel-footer">
        <Button size="md" color="pink" onClick={goToMap}>
          {LogisticsMapPanel.getButtonText(activeItems)}
        </Button>
      </div>
    </div>
  );
}

LogisticsMapPanel.nodeTypeRenderer = () => 'Company';
LogisticsMapPanel.getButtonText = items => {
  switch (items.length) {
    case 0:
      return 'See all';
    case 1:
      return 'See company (1)';
    default:
      return `See companies (${items.length})`;
  }
};

LogisticsMapPanel.propTypes = {
  items: PropTypes.array,
  hideFooter: PropTypes.bool
};

export default LogisticsMapPanel;
