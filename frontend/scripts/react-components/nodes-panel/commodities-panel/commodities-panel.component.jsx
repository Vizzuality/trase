import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import ResizeListener from 'react-components/shared/resize-listener.component';
import { BREAKPOINTS } from 'constants';

function CommoditiesPanel(props) {
  const {
    loading,
    fetchKey,
    commodities,
    selectedNodeId,
    setSelectedItem,
    setPage,
    page,
    draftPreviousSteps,
    fetchData
  } = props;

  useEffect(() => {
    if (draftPreviousSteps !== fetchKey || fetchKey === null) {
      fetchData(draftPreviousSteps);
    }
  }, [draftPreviousSteps, fetchData, fetchKey]);

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
              getMoreItems={setPage}
              page={page}
              loading={loading}
            >
              {itemProps => (
                <GridListItem
                  {...itemProps}
                  isActive={selectedNodeId === itemProps.item?.id}
                  enableItem={setSelectedItem}
                  disableItem={() => setSelectedItem(null)}
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
  fetchKey: PropTypes.string,
  draftPreviousSteps: PropTypes.string,
  commodities: PropTypes.array,
  loading: PropTypes.bool,
  page: PropTypes.number.isRequired,
  selectedNodeId: PropTypes.number,
  setPage: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired
};

export default CommoditiesPanel;
