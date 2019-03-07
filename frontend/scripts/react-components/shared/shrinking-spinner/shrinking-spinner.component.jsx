import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './shrinking-spinner.scss';

function ShrinkingSpinner({ className }) {
  return (
    <div className={cx('c-shrinking-spinner', className)}>
      <svg className="shrinking-spinner-circle-container" viewBox="25 25 50 50">
        <circle
          className="shrinking-spinner-circle"
          cx={50}
          cy={50}
          r={20}
          fill="none"
          strokeWidth={2}
          strokeMiterlimit={10}
        />
      </svg>
    </div>
  );
}

ShrinkingSpinner.propTypes = {
  className: PropTypes.string
};

export default ShrinkingSpinner;
