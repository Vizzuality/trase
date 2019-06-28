import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './icon.scss';

function Icon(props) {
  const { icon, color, size } = props;
  switch (icon) {
    case 'icon-arrow':
      return <span className={cx('icon', icon, { [`color-${color}`]: color })} />;
    case 'icon-arrow-up':
      return <span className={cx('icon', icon, { [`color-${color}`]: color }, 'direction-up')} />;
    default:
      return (
        <svg
          className={cx(`icon ${icon}`, { [`color-${color}`]: color, [`size-${size}`]: size })}
          style={{ pointerEvents: 'none' }}
        >
          <use xlinkHref={`#${icon}`} />
        </svg>
      );
  }
}

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.string
};

export default Icon;
