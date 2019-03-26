import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './button.scss';

// TODO: remove className prop, currently the application buttons are so fragmented
//  that we need to provide a escape hatch.
function Button(props) {
  const { as, variant, color, size, weight, children, icon, iconPosition, ...rest } = props;
  const buttonProps = {
    ...rest,
    className: cx('c-button', rest.className, {
      [`v-${variant}`]: variant,
      [`color-${color}`]: color,
      [`size-${size}`]: size,
      [`weight-${weight}`]: weight,
      'with-icon': icon
    }),
    type: as === 'button' ? as : undefined
  };

  const iconComponent = (
    <svg className={`icon ${icon}`} style={{ pointerEvents: 'none' }}>
      <use xlinkHref={`#${icon}`} />
    </svg>
  );

  const shouldUseChildrenContainer =
    typeof children === 'string' ||
    (Array.isArray(children) && children.every(child => typeof child === 'string'));

  const childrenWithContainer = (
    <span className="button-text-container" title={children}>
      {Array.isArray(children) ? children.join('') : children}
    </span>
  );

  const childrenWithIcon = (
    <>
      {icon && iconPosition === 'left' && iconComponent}
      {shouldUseChildrenContainer ? childrenWithContainer : children}
      {icon && iconPosition === 'right' && iconComponent}
    </>
  );

  return React.createElement(as, buttonProps, childrenWithIcon);
}

Button.defaultProps = {
  as: 'button',
  iconPosition: 'right'
};

Button.propTypes = {
  icon: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  weight: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.string,
  className: PropTypes.string,
  iconPosition: PropTypes.string,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default Button;
