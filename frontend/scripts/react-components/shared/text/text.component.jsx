import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './text.scss';

function Text(props) {
  const { as, variant, color, size, align, weight, children, ...rest } = props;
  const textProps = {
    ...rest,
    className: cx('c-text', variant, {
      [`color-${color}`]: color,
      [`size-${size}`]: size,
      [`weight-${weight}`]: weight,
      [`align-${align}`]: align
    })
  };
  return React.createElement(as, textProps, children);
}

Text.defaultProps = {
  as: 'p',
  size: 'rg',
  color: 'grey',
  weight: 'light',
  variant: 'serif'
};

Text.propTypes = {
  size: PropTypes.string,
  align: PropTypes.string,
  color: PropTypes.string,
  weight: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.string,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default Text;
