import React from 'react';
import PropTypes from 'prop-types';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';

function CommoditiesPanel(props) {
  const { loading, commodities, activeCommodities, onSelectCommodity, getMoreItems, page } = props;
  return (
    <React.Fragment>
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
        loading={loading}
      >
        {itemProps => (
          <GridListItem
            {...itemProps}
            isActive={activeCommodities.find(i => i.id === itemProps.item?.id)}
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
  loading: PropTypes.bool,
  page: PropTypes.number.isRequired,
  activeCommodities: PropTypes.array,
  getMoreItems: PropTypes.func.isRequired,
  onSelectCommodity: PropTypes.func.isRequired
};

export default CommoditiesPanel;
