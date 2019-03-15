import React, { useState } from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range';
import cx from 'classnames';

function YearsRange(props) {
  const [[start, end], setYears] = useState(props.selectedYears);
  const [hovered, setHovered] = useState(null);

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
    }
  }

  function getClassName(year) {
    const [startYear, endYear] = [start || hovered, end || hovered].sort();
    const classes = [];

    if (range(startYear, (endYear || startYear) + 1).includes(year)) {
      classes.push('active');
    }
    if (year === startYear) {
      classes.push('start');
    }
    if (year === endYear) {
      classes.push('end');
    }

    return classes.join(' ');
  }

  const { years } = props;
  const isSelected = start && end;

  return (
    <div className={cx('c-years-selector', isSelected ? 'selected' : 'selecting')}>
      <div className="years-selector-content">
        {years.map(year => (
          <button
            key={year}
            onClick={() => setActive(year)}
            onMouseOver={() => setHovered(year)}
            onFocus={() => setHovered(year)}
            className={cx('button', getClassName(year))}
          >
            <div className="unrotate">
              <div className="fill">
                <span>{year}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="years-selector-footer">
        <p>{!end ? 'Select an end year' : 'Select one or more year(s)'}</p>
      </div>
    </div>
  );
}

YearsRange.propTypes = {
  years: PropTypes.array,
  onSelected: PropTypes.func,
  selectedYears: PropTypes.array
};

export default YearsRange;
