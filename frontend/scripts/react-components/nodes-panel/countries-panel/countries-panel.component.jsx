import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';

import './countries-panel.scss';

function CountriesPanel(props) {
  const {
    countries,
    width,
    columnsCount,
    selectedNodeId,
    loading,
    setSelectedItem,
    fetchData,
    fetchKey
  } = props;

  useEffect(() => {
    if (fetchKey === null) {
      fetchData(true);
    }
  }, [fetchData, fetchKey]);

  return (
    <div className="c-countries-panel">
      <GridList
        className="country-sources-panel-pill-list"
        height={Math.min(200, Math.ceil(countries.length / columnsCount) * 50)}
        width={width}
        columnWidth={190}
        rowHeight={50}
        columnCount={columnsCount}
        items={countries}
        loading={!selectedNodeId && loading}
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
}

CountriesPanel.propTypes = {
  fetchData: PropTypes.func.isRequired,
  countries: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  columnsCount: PropTypes.number.isRequired,
  selectedNodeId: PropTypes.number,
  loading: PropTypes.bool.isRequired,
  setSelectedItem: PropTypes.func.isRequired
};

export default CountriesPanel;
