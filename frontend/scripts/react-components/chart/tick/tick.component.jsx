import React from 'react';
import PropTypes from 'prop-types';
import isIe from 'utils/isIe';

function Tick(props) {
  const { x, y, payload, unitFormat, fill, backgroundColor } = props;

  const tickValue = payload && payload.value;
  const formattedTick = tickValue ? unitFormat(tickValue) : 0;

  return (
    <g transform={`translate(${x},${y})`}>
      <defs>
        {!isIe() && (
          <filter x="0" y="0" width="1" height="1" id="solid">
            <feFlood floodColor={backgroundColor || '#fff'} />
            <feComposite in="SourceGraphic" />
          </filter>
        )}
      </defs>
      <text
        className="tick-text"
        filter={!isIe() ? 'url(#solid)' : ''}
        x="0"
        y="3"
        textAnchor="start"
        fill={fill}
      >
        {formattedTick}
      </text>
    </g>
  );
}

Tick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.shape({
    value: PropTypes.string
  }),
  unitFormat: PropTypes.func.isRequired,
  fill: PropTypes.string,
  backgroundColor: PropTypes.string
};

Tick.defaultProps = {
  x: 0,
  y: 0,
  payload: {},
  backgroundColor: ''
};

export default Tick;
