import React from 'react';
import PropTypes from 'prop-types';
import 'react-components/chart/tick/tick-styles.scss';

function Label({ x, y, children }) {
  return (
    <text transform={`translate(${x},${y})`} className="tick-text" filter="url(#solid)" x="0" y="3">
      {children}
    </text>
  );
}

Label.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  children: PropTypes.node
};

Label.defaultProps = {
  x: 0,
  y: 0
};

export default Label;
