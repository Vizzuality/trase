import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import './radio-button.scss';

function RadioButton(props) {
  return (
    <button
      className={cx('c-radio-btn', props.className, {
        '-enabled': props.enabled,
        '-no-self-cancel': props.noSelfCancel
      })}
      onClick={props.onClick}
    />
  );
}

RadioButton.propTypes = {
  enabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  noSelfCancel: PropTypes.bool
};

export default RadioButton;
