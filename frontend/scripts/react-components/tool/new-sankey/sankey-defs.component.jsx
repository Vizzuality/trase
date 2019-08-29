import React from 'react';

const stops = {
  default: [{ color: '#28343b', opacity: 0.3 }, { color: '#28343b', opacity: 0.2 }],
  selection: [{ color: '#ea6869' }, { color: '#ffeb8b' }],
  biome: [{ color: '#43f3f3' }, { color: '#517fee' }, { color: '#72ea28' }, { color: '#ffb314' }],
  'red-blue': [
    { color: '#6F0119' },
    { color: '#a50026' },
    { color: '#5488C0' },
    { color: '#246AB6' }
  ],
  'yellow-green': [
    { color: '#ffc' },
    { color: '#c2e699' },
    { color: '#31a354' },
    { color: '#006837' }
  ],
  'green-red': [
    { color: '#006837' },
    { color: '#1a9850' },
    { color: '#fee08b' },
    { color: '#6f001a' }
  ]
};

export const IsAggregate = () => (
  <pattern id="isAggregatedPattern" x="0" y="0" width="1" height="3" patternUnits="userSpaceOnUse">
    <rect x="0" y="0" width="50" height="1" fill="#ddd" />
    <rect x="0" y="1" width="50" height="2" fill="#fff" />
  </pattern>
);

export const GradientAnimation = ({ selectedRecolorBy, selectedNodesIds }) => {
  let selectedColor = selectedNodesIds.length > 0 ? 'selection' : 'default';
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
  return (
    <linearGradient
      key={selectedColor}
      id="animate-gradient"
      x1="0%"
      y1="0%"
      x2="120%"
      y2="0"
      spreadMethod="reflect"
    >
      {stops[selectedColor].map((stop, i, list) => (
        <stop
          offset={i / (list.length - 1)}
          stopColor={stop.color}
          stopOpacity={stop.opacity || 0.5}
        />
      ))}
      <animate id="one" attributeName="x1" values="0%;100%" dur="3s" repeatCount="indefinite" />
      <animate id="two" attributeName="x2" values="100%;200%" dur="3s" repeatCount="indefinite" />
    </linearGradient>
  );
};

export const LinksPlaceHolder = ({
  gapBetweenColumns,
  sankeyColumnsWidth,
  size = 3,
  height = 575
}) =>
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
  ));

export const ColumnsPlaceholder = ({
  sankeyColumnsWidth,
  gapBetweenColumns,
  size = 4,
  height = 575
}) =>
  Array.from({ length: size }).map((_, i) => (
    <rect
      key={i}
      height={height}
      width={sankeyColumnsWidth}
      className="sankey-column-placeholder"
      transform={`translate(${i * (sankeyColumnsWidth + gapBetweenColumns)},0)`}
    />
  ));
