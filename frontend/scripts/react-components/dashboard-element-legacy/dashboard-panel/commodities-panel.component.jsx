import React from 'react';
import PropTypes from 'prop-types';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import ResizeListener from 'react-components/shared/resize-listener.component';
import { BREAKPOINTS } from 'constants';

function CommoditiesPanel(props) {
  const { loading, commodities, activeCommodities, onSelectCommodity, getMoreItems, page } = props;
  return (
    <ResizeListener>
      {({ windowWidth }) => {
        const columnsCount = windowWidth > BREAKPOINTS.laptop ? 5 : 3;
        const width = windowWidth > BREAKPOINTS.laptop ? 950 : 560;
        return (
          <div className="grid-container">
            <GridList
              className="dashboard-panel-pill-list"
              items={commodities}
              height={commodities.length > columnsCount ? 200 : 50}
              width={width}
              rowHeight={50}
              columnWidth={190}
              columnCount={columnsCount}
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
          </div>
        );
      }}
    </ResizeListener>
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
