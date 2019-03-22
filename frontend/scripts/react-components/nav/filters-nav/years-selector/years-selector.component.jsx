/* eslint-disable jsx-a11y/mouse-events-have-key-events, jsx-a11y/no-static-element-interactions, react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import YearsRange from 'react-components/shared/years-range/years-range.component';
import Dropdown from 'react-components/shared/dropdown';

function YearsSelector(props) {
  const { years, selectedYears, selectYears, variant } = props;
  const multipleYears = selectedYears[0] !== selectedYears[1];
  const yearsValue = multipleYears ? `${selectedYears[0]} - ${selectedYears[1]}` : selectedYears[0];

  return (
    <Dropdown
      variant={variant}
      placement="bottom-start"
      label={multipleYears ? 'years' : 'year'}
      selectedValueOverride={yearsValue}
    >
      <YearsRange selectedYears={selectedYears} years={years} onSelected={selectYears} />
    </Dropdown>
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
