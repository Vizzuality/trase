import React from 'react';
import PropTypes from 'prop-types';
import { MIN_COLUMNS_NUMBER } from 'constants';

const stops = {
  default: [
    { color: '#28343b', opacity: 0.2 },
    { color: '#28343b', opacity: 0.1 },
    { color: '#28343b', opacity: 0.2 }
  ],
  rainbow: [
    { color: '#43f3f3' },
    { color: '#517fee' },
    { color: '#8c28ff' },
    { color: '#ff66e5' },
    { color: '#72ea28' },
    { color: '#ffb314' },
    { color: '#72ea28' },
    { color: '#ff66e5' },
    { color: '#8c28ff' },
    { color: '#517fee' },
    { color: '#43f3f3' }
  ]
};

export const IsAggregate = React.memo(() => (
  <pattern id="isAggregatedPattern" x="0" y="0" width="1" height="4" patternUnits="userSpaceOnUse">
    <rect x="0" y="0" width="50" height="1" fill="#ddd" />
    <rect x="0" y="1" width="50" height="2" fill="#fff" />
  </pattern>
));

export const GradientAnimation = React.memo(({ candyMode }) => {
  let selectedColor = 'default';

  // easter egg :P
  if (candyMode === true) {
    selectedColor = 'rainbow';
  }

  return (
    <linearGradient
      key={selectedColor}
      id="animate-gradient"
      x1="0%"
      y1="0%"
      x2="100%"
      y2="0"
      spreadMethod="reflect"
    >
      {stops[selectedColor].map((stop, i, list) => (
        <stop
          key={i}
          offset={i / (list.length - 1)}
          stopColor={stop.color}
          stopOpacity={stop.opacity || 0.5}
        />
      ))}

      <animate
        id="forwards-one"
        attributeName="x1"
        values="0%;100%"
        dur="2s"
        repeatCount="indefinite"
      />
      <animate
        id="forwards-two"
        attributeName="x2"
        values="100%;200%"
        dur="2s"
        repeatCount="indefinite"
      />
    </linearGradient>
  );
});

GradientAnimation.propTypes = {
  candyMode: PropTypes.bool
};

// to avoid propTypes error
const linksPlaceHolderFunction = props => {
  const {
    gapBetweenColumns,
    sankeyColumnsWidth,
    size = MIN_COLUMNS_NUMBER - 1,
    height = 525
  } = props;
  return Array.from({ length: size }).map((_, i) => (
    <rect
      key={i}
      height={height}
      width={gapBetweenColumns}
      transform={`translate(${i * gapBetweenColumns +
        i * sankeyColumnsWidth +
        sankeyColumnsWidth},0)`}
      fill="url(#animate-gradient)"
    />
  ));
};
export const LinksPlaceHolder = React.memo(linksPlaceHolderFunction);

linksPlaceHolderFunction.propTypes = {
  gapBetweenColumns: PropTypes.number,
  sankeyColumnsWidth: PropTypes.number,
  size: PropTypes.number,
  height: PropTypes.number
};

const columnsPlaceholderFunction = props => {
  const { sankeyColumnsWidth, gapBetweenColumns, size = MIN_COLUMNS_NUMBER, height = 525 } = props;
  return Array.from({ length: size }).map((_, i) => (
    <rect
      key={i}
      height={height}
      width={sankeyColumnsWidth}
      className="sankey-column-placeholder"
      transform={`translate(${i * (sankeyColumnsWidth + gapBetweenColumns)},0)`}
    />
  ));
};
export const ColumnsPlaceholder = React.memo(columnsPlaceholderFunction);

columnsPlaceholderFunction.propTypes = {
  gapBetweenColumns: PropTypes.number,
  sankeyColumnsWidth: PropTypes.number,
  size: PropTypes.number,
  height: PropTypes.number
};
