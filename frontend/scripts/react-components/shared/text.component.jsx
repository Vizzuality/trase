import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import 'styles/components/shared/text.scss';

function Text(props) {
  const { as, children, variant, ...rest } = props;
  const textProps = {
    ...rest,
    className: cx('c-text', variant)
  };
  return React.createComponent(as, textProps, children);
}

Text.defaultProps = {
  as: 'p',
  variant: 'serif'
};

Text.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default Text;
