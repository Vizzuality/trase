import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './text.scss';

function Text(props) {
  const { as, variant, color, size, align, weight, children, className, ...rest } = props;
  const textProps = {
    ...rest,
    className: cx(
      'c-text',
      variant,
      {
        [`color-${color}`]: color,
        [`size-${size}`]: size,
        [`weight-${weight}`]: weight,
        [`align-${align}`]: align,
        [`transform-${transform}`]: transform
      },
      className
    )
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
  transform: PropTypes.string,
  className: PropTypes.string, // Use only for positioning
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default Text;
