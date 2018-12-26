import React from 'react';
import PropTypes from 'prop-types';

import './toggle.scss';

function Toggle(props) {
  const useColor = (props.color && props.checked) || undefined;
  return (
    <input
      id={props.id}
      className="c-toggle"
      type="checkbox"
      checked={props.checked}
      onChange={props.onChange}
      style={useColor && { backgroundColor: props.color }}
    />
  );
}

Toggle.propTypes = {
  id: PropTypes.string,
  color: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func
};

export default Toggle;
