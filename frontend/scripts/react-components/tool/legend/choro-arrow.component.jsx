import React from 'react';
import PropTypes from 'prop-types';

import 'react-components/tool/legend/choro-arrow.scss';

export default function ChoroArrow({ ticks }) {
  const tickPoints = Array.from({ length: ticks }).map((_, index) => ({
    x: ((index + 1) / (ticks + 1)) * 100,
    y: 2
  }));

  return (
    <svg height="5" width="100%" className="choro-arrow">
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
      <line className="arrow-line" x1="0" y1="2" x2="97%" y2="2" markerEnd="url(#arrowTriangle)" />
      <g className="arrow-ticks">
        {tickPoints.map((p, index) => (
          <line key={index} x1={`${p.x}%`} y1={p.y - 2} x2={`${p.x}%`} y2={p.y + 2} />
        ))}
      </g>
    </svg>
  );
}

ChoroArrow.propTypes = {
  ticks: PropTypes.number.isRequired
};
