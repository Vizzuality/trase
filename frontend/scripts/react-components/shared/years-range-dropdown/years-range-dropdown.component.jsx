import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-components/shared/dropdown';
import YearsRange from './years-range/years-range.component';

function YearsRangeDropdown(props) {
  const { years, selectedYears, selectYears, ...rest } = props;
  const multipleYears = selectedYears[0] !== selectedYears[1];
  const yearsValue = multipleYears ? `${selectedYears[0]} - ${selectedYears[1]}` : selectedYears[0];

  return (
    <Dropdown
      placement="bottom-start"
      label={multipleYears ? 'years' : 'year'}
      selectedValueOverride={yearsValue}
      {...rest}
    >
      <YearsRange selectedYears={selectedYears} years={years} onSelected={selectYears} />
    </Dropdown>
  );
}

YearsRangeDropdown.propTypes = {
  years: PropTypes.array,
  variant: PropTypes.string,
  selectYears: PropTypes.func,
  selectedYears: PropTypes.array
};

export default YearsRangeDropdown;
