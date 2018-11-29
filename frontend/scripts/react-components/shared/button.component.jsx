import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import 'styles/components/shared/button.scss';

function Button(props) {
  const { as, children, ...rest } = props;
  const buttonProps = { ...rest, className: cx('c-button', rest.className) };

  return React.createElement(as, buttonProps, children);
}

Button.defaultProps = {
  as: 'button'
};

Button.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  children: PropTypes.node,
  className: PropTypes.string
};

export default Button;
