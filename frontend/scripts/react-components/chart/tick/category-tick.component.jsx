import React from 'react';
import PropTypes from 'prop-types';
import wrapSVGText from 'utils/wrapSVGText';
import 'react-components/chart/tick/tick-styles.scss';

function CategoryTick(props) {
  const { x, y, payload } = props;
  const tickValue = payload && payload.value;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x="0" y="3" className="tick-text" fill="#fff">
        {wrapSVGText(tickValue, 10, 10, 15, 1)}
      </text>
      {tickValue.length > 15 && <title>{tickValue}</title>}
    </g>
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
