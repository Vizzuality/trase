import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range';
import cx from 'classnames';
import { Context as DropdownContext } from 'react-components/shared/dropdown';
import Text from 'react-components/shared/text';

import './years-range.scss';

function YearsRange(props) {
  const [[start, end], setYears] = useState(props.selectedYears);
  const [hovered, setHovered] = useState(null);
  const { toggleMenu } = useContext(DropdownContext);

  function setActive(year) {
    const { onSelected } = props;

    if (end !== null) {
      setYears([year, null]);
    } else {
      const newStart = Math.min(start, year);
      const newEnd = Math.max(start, year);
      const years = [newStart, newEnd];
      setYears(years);
      onSelected(years);

      if (typeof toggleMenu !== 'undefined') {
        toggleMenu();
      }
    }
  }

  function getClassName(year) {
    const [startYear, endYear] = [start || hovered, end || hovered].sort();
    const classes = [];

    if (range(startYear, (endYear || startYear) + 1).includes(year)) {
      classes.push('-active');
    }
    if (year === startYear) {
      classes.push('-start');
    }
    if (year === endYear) {
      classes.push('-end');
    }

    return classes.join(' ');
  }

  const { years } = props;
  const isSelected = start && end;

  return (
    <div className={cx('c-years-range', isSelected ? '-selected' : '-selecting')}>
      <div className="years-range-content">
        {years.map(year => (
          <button
            key={year}
            onClick={() => setActive(year)}
            onMouseOver={() => setHovered(year)}
            onFocus={() => setHovered(year)}
            className={cx('years-range-button', getClassName(year))}
            data-test={`years-range-button-${year}`}
          >
            <div className="years-range-unrotate">
              <div className="years-range-fill">
                <Text
                  as="span"
                  className="year-label notranslate"
                  variant="mono"
                  size="sm"
                  color="grey-faded"
                  transform="uppercase"
                >
                  {year}
                </Text>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="years-range-footer">
        <Text variant="mono" size="sm" color="grey-faded" transform="uppercase">
          {!end ? 'Select an end year' : 'Select one or more year(s)'}
        </Text>
      </div>
    </div>
  );
}

YearsRange.propTypes = {
  years: PropTypes.array.isRequired,
  onSelected: PropTypes.func.isRequired,
  selectedYears: PropTypes.array.isRequired
};

export default React.memo(YearsRange);
