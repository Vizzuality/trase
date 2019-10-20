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
    selectedCountryId,
    loading,
    onSelectCountry,
    fetchData
  } = props;

  useEffect(() => {
    fetchData();
  }, [fetchData]);
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
        loading={!selectedCountryId && loading}
      >
        {itemProps => (
          <GridListItem
            {...itemProps}
            isActive={selectedCountryId === itemProps.item?.id}
            enableItem={onSelectCountry}
            disableItem={() => onSelectCountry(null)}
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
  selectedCountryId: PropTypes.number,
  loading: PropTypes.bool.isRequired,
  onSelectCountry: PropTypes.func.isRequired
};

export default CountriesPanel;
