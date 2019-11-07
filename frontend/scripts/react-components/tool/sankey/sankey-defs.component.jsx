import React from 'react';
import PropTypes from 'prop-types';
import { MIN_COLUMNS_NUMBER } from 'constants';

if (typeof window !== 'undefined') {
  window._TRASE_RAINBOW_SANKEY = false;
}

const stops = {
  default: [
    { color: '#28343b', opacity: 0.2 },
    { color: '#28343b', opacity: 0.1 },
    { color: '#28343b', opacity: 0.2 }
  ],
  selection: [{ color: '#ea6869' }, { color: '#ffeb8b' }, { color: '#ea6869' }],
  biome: [
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
  ],
  'red-blue': [
    { color: '#6F0119' },
    { color: '#a50026' },
    { color: '#5488C0' },
    { color: '#246AB6' },
    { color: '#5488C0' },
    { color: '#a50026' },
    { color: '#6F0119' }
  ],
  'yellow-green': [
    { color: '#ffc' },
    { color: '#c2e699' },
    { color: '#31a354' },
    { color: '#006837' },
    { color: '#31a354' },
    { color: '#c2e699' },
    { color: '#ffc' }
  ],
  'green-red': [
    { color: '#006837' },
    { color: '#1a9850' },
    { color: '#fee08b' },
    { color: '#f46d43' },
    { color: '#d73027' },
    { color: '#6f001a' },
    { color: '#d73027' },
    { color: '#f46d43' },
    { color: '#fee08b' },
    { color: '#1a9850' },
    { color: '#006837' }
  ]
};

export const IsAggregate = React.memo(() => (
  <pattern id="isAggregatedPattern" x="0" y="0" width="1" height="3" patternUnits="userSpaceOnUse">
    <rect x="0" y="0" width="50" height="1" fill="#ddd" />
    <rect x="0" y="1" width="50" height="2" fill="#fff" />
  </pattern>
));

export const GradientAnimation = React.memo(({ selectedRecolorBy, selectedNodesIds }) => {
  let selectedColor = 'default';

  // easter egg :P
  if (window._TRASE_RAINBOW_SANKEY === true) {
    selectedColor = selectedNodesIds.length > 0 ? 'selection' : 'default';
    if (selectedRecolorBy) {
      selectedColor = selectedRecolorBy.legendColorTheme;
      if (selectedColor === 'thematic') {
        if (selectedRecolorBy.name === 'BIOME') {
          selectedColor = 'biome';
        } else {
          selectedColor = 'default';
        }
      }
    }
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
  selectedRecolorBy: PropTypes.object,
  selectedNodesIds: PropTypes.array
};

export const LinksPlaceHolder = React.memo(
  ({ gapBetweenColumns, sankeyColumnsWidth, size = MIN_COLUMNS_NUMBER - 1, height = 575 }) =>
    Array.from({ length: size }).map((_, i) => (
      <rect
        key={i}
        height={height}
        width={gapBetweenColumns}
        transform={`translate(${i * gapBetweenColumns +
          i * sankeyColumnsWidth +
          sankeyColumnsWidth},0)`}
        fill="url(#animate-gradient)"
      />
    ))
);
LinksPlaceHolder.propTypes = {
  gapBetweenColumns: PropTypes.number,
  sankeyColumnsWidth: PropTypes.number,
  size: PropTypes.number,
  height: PropTypes.number
};

export const ColumnsPlaceholder = React.memo(
  ({ sankeyColumnsWidth, gapBetweenColumns, size = MIN_COLUMNS_NUMBER, height = 575 }) =>
    Array.from({ length: size }).map((_, i) => (
      <rect
        key={i}
        height={height}
        width={sankeyColumnsWidth}
        className="sankey-column-placeholder"
        transform={`translate(${i * (sankeyColumnsWidth + gapBetweenColumns)},0)`}
      />
    ))
);
ColumnsPlaceholder.propTypes = {
  gapBetweenColumns: PropTypes.number,
  sankeyColumnsWidth: PropTypes.number,
  size: PropTypes.number,
  height: PropTypes.number
};
