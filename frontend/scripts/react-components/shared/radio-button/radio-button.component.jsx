import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import './radio-button.scss';

function RadioButton(props) {
  const { enabled, onClick, className, noSelfCancel, disabled } = props;
  return (
    <button
      className={cx('c-radio-btn', className, {
        '-enabled': enabled,
        '-no-self-cancel': noSelfCancel
      })}
      onClick={onClick}
      disabled={disabled}
    />
  );
}

RadioButton.propTypes = {
  enabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  noSelfCancel: PropTypes.bool,
  disabled: PropTypes.bool
};

export default RadioButton;
