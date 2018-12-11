import React from 'react';
import PropTypes from 'prop-types';

import './toggle.scss';

function Toggle(props) {
  return (
    <input
      id={props.id}
      className="c-toggle"
      type="checkbox"
      checked={props.checked}
      onChange={props.onChange}
    />
  );
}

Toggle.propTypes = {
  id: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func
};

export default Toggle;
