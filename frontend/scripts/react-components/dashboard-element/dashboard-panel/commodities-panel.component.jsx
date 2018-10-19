import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item.component';

function CommoditiesPanel(props) {
  const {
    getSearchResults,
    loadingMoreItems,
    searchCommodities,
    commodities,
    activeCommodityId,
    onSelectCommodity,
    getMoreItems,
    page
  } = props;
  return (
    <React.Fragment>
      <SearchInput
        className="dashboard-panel-search"
        items={searchCommodities}
        placeholder="Search commodity"
        onSelect={onSelectCommodity}
        onSearchTermChange={getSearchResults}
      />
      <GridList
        className="dashboard-panel-pill-list"
        items={commodities}
        height={commodities.length > 5 ? 200 : 50}
        width={950}
        rowHeight={50}
        columnWidth={190}
        columnCount={5}
        getMoreItems={getMoreItems}
        page={page}
        loading={loadingMoreItems}
      >
        {itemProps => (
          <GridListItem
            {...itemProps}
            isActive={activeCommodityId === (itemProps.item && itemProps.item.id)}
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
  loadingMoreItems: PropTypes.bool,
  page: PropTypes.number.isRequired,
  searchCommodities: PropTypes.array,
  activeCommodityId: PropTypes.number,
  getMoreItems: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  onSelectCommodity: PropTypes.func.isRequired
};

export default CommoditiesPanel;
