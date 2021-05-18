import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from 'react-components/shared/icon';
import './button.scss';

function Button(props) {
  const { as, variant, color, size, weight, children, icon, iconPosition, testId, ...rest } = props;
  const buttonProps = {
    ...rest,
    'data-test': testId,
    className: cx('c-new-button', rest.className, {
      [`v-${variant}`]: variant,
      [`color-${color}`]: color,
      [`size-${size}`]: size,
      [`weight-${weight}`]: weight,
      'with-icon': icon
    }),
    type: as === 'button' ? as : undefined
  };

  const shouldUseChildrenContainer =
    typeof children === 'string' ||
    (Array.isArray(children) && children.every(child => typeof child === 'string'));

  const childrenWithContainer = (
    <span className="button-text-container" title={children}>
      {Array.isArray(children) ? children.join('') : children}
    </span>
  );

  const iconColors = {
    charcoal: 'white'
  };

  const renderIcon = icon && <Icon icon={icon} color={color && iconColors[color]} />;

  const childrenWithIcon = (
    <>
      {icon && iconPosition === 'left' && renderIcon}
      {shouldUseChildrenContainer ? childrenWithContainer : children}
      {icon && iconPosition === 'right' && renderIcon}
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
  testId: PropTypes.string,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default Button;
