
import React from 'react';
import { PropTypes } from 'prop-types';
import './mapbox-map-warnings.scss';
import cx from 'classnames';

const Warnings = ({ warnings }) => (
  <div className={cx('map-warnings',{ '-visible': warnings })}>
    <div className="warning-wrapper">
      <svg className="icon">
        <use xlinkHref="#icon-warning" />
      </svg>
      <span>{warnings}</span>
    </div>
  </div>
);

export default Warnings;

Warnings.propTypes = {
  warnings: PropTypes.string
}