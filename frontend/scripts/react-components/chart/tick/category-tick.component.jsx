import React from 'react';
import PropTypes from 'prop-types';
import 'react-components/chart/tick/tick-styles.scss';

function CategoryTick(props) {
  const { x, y, payload } = props;
  const tickValue = payload && payload.value;

  return (
    <text transform={`translate(${x},${y})`} className="tick-text" filter="url(#solid)" x="0" y="3">
      {tickValue}
    </text>
  );
}

CategoryTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.shape({})
};

CategoryTick.defaultProps = {
  x: 0,
  y: 0,
  payload: {}
};

export default CategoryTick;
