import React from 'react';
import PropTypes from 'prop-types';
import YearsRangeDropdown from 'react-components/shared/years-range-dropdown';

function YearsSelector(props) {
  const { years, selectedYears, selectYears, variant, ...rest } = props;

  return (
    <YearsRangeDropdown
      years={years}
      variant={variant}
      selectYears={selectYears}
      selectedYears={selectedYears}
      {...rest}
    />
  );
}

YearsSelector.propTypes = {
  years: PropTypes.array,
  variant: PropTypes.string,
  selectYears: PropTypes.func,
  selectedYears: PropTypes.array
};

YearsSelector.defaultProps = {
  variant: 'nav'
};

export default YearsSelector;
