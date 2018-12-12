import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './button.scss';

// TODO: remove className prop, currently the application buttons are so fragmented
//  that we need to provide a escape hatch.
function Button(props) {
  const { as, variant, color, size, weight, children, ...rest } = props;
  const buttonProps = {
    ...rest,
    className: cx('c-button', variant, rest.className, {
      [`color-${color}`]: color,
      [`size-${size}`]: size,
      [`weight-${weight}`]: weight
    }),
    type: as === 'button' ? as : undefined
  };

  return React.createElement(as, buttonProps, children);
}

Button.defaultProps = {
  as: 'button'
};

Button.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  weight: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.string,
  className: PropTypes.string,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default Button;
