import React from 'react';
import PropTypes from 'prop-types';

import 'react-components/tool/choro-arrow/choro-arrow.scss';

export default function ChoroArrow({ ticks, width }) {
  const tickPoints = [...Array(ticks)].map((_, index) => ({
    x: (index + 1) * (width / (ticks + 1)),
    y: 2
  }));

  return (
    <svg height="5" width={width} className="choro-arrow">
      <defs>
        <marker
          id="arrowTriangle"
          markerWidth="5"
          markerHeight="5"
          refX="1"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polyline points="1 1, 5 3, 1 5" />
        </marker>
      </defs>
      <line
        className="arrow-line"
        x1="0"
        y1="2"
        x2={width - 4}
        y2="2"
        markerEnd="url(#arrowTriangle)"
      />
      <g className="arrow-ticks">
        {tickPoints.map((p, index) => (
          <line key={index} x1={p.x} y1={p.y - 2} x2={p.x} y2={p.y + 2} />
        ))}
      </g>
    </svg>
  );
}

ChoroArrow.defaultProps = {
  width: 100
};

ChoroArrow.propTypes = {
  ticks: PropTypes.number.isRequired,
  width: PropTypes.number
};
