import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item.component';

function CommoditiesPanel(props) {
  const { searchCommodities, commodities, activeCommodityId, onSelectCommodity } = props;
  return (
    <React.Fragment>
      <SearchInput
        className="dashboard-panel-search"
        items={searchCommodities}
        placeholder="Search place"
        onSelect={i => i}
      />
      <p className="dashboard-panel-text">You can choose up to three commodities:</p>
      <GridList
        items={commodities}
        height={commodities.length > 5 ? 200 : 50}
        width={950}
        rowHeight={50}
        columnWidth={190}
        columnCount={5}
      >
        {itemProps => (
          <GridListItem
            {...itemProps}
            isActive={activeCommodityId === (itemProps.item && itemProps.item.name)}
            enableItem={onSelectCommodity}
            disableItem={() => onSelectCommodity(null)}
          />
        )}
      </GridList>
    </React.Fragment>
  );
}

CommoditiesPanel.propTypes = {
  commodities: PropTypes.array,
  searchCommodities: PropTypes.array,
  activeCommodityId: PropTypes.string,
  onSelectCommodity: PropTypes.func.isRequired
};

export default CommoditiesPanel;
