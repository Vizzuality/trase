import React from 'react';
import { PropTypes } from 'prop-types';
import './map-warnings.scss';
import cx from 'classnames';

const Warnings = ({ warnings }) => (
  <div className={cx('map-warnings', { '-visible': warnings })}>
    <div className="warning-wrapper">
      <svg className="icon">
        <use xlinkHref="#icon-warning-bell" />
      </svg>
      <span>
        {Array.isArray(warnings)
          ? warnings.map(warning =>
              warning === 'YEAR_RANGE_WARNING' ? (
                <>
                  <span className="warnings-bold">Important: </span>The boundaries of one or more
                  concessions have shifted during the years of the selected time-range. The latest
                  ones are shown in the map.
                </>
              ) : (
                warning
              )
            )
          : warnings}
      </span>
    </div>
  </div>
);

export default Warnings;

Warnings.propTypes = {
  warnings: PropTypes.string
};
