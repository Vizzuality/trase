import React from 'react';

export const IsAggregate = () => (
  <pattern id="isAggregatedPattern" x="0" y="0" width="1" height="3" patternUnits="userSpaceOnUse">
    <rect x="0" y="0" width="50" height="1" fill="#ddd" />
    <rect x="0" y="1" width="50" height="2" fill="#fff" />
  </pattern>
);

export const GradientAnimation = ({ selectedRecolorBy, selectedNodesIds }) => {
  const stops = {
    default: [
      { color: '#28343b', opacity: 0.4 },
      { color: '#28343b', opacity: 0.2 },
      { color: '#28343b', opacity: 0.1 },
      { color: '#28343b', opacity: 0.1 },
      { color: '#28343b', opacity: 0.1 },
      { color: '#28343b', opacity: 0.2 },
      { color: '#28343b', opacity: 0.4 }
    ],
    selection: [
      { color: '#ea6869', opacity: 0.5 },
      { color: '#ffeb8b', opacity: 0.5 },
      { color: '#2d586e', opacity: 0.5 },
      { color: '#b4008a', opacity: 0.5 },
      { color: '#2d586e', opacity: 0.5 },
      { color: '#ffeb8b', opacity: 0.5 },
      { color: '#ea6869', opacity: 0.5 }
    ],
    biome: [
      { color: '#43f3f3', opacity: 0.5 },
      { color: '#517fee', opacity: 0.5 },
      { color: '#8c28ff', opacity: 0.5 },
      { color: '#ff66e5', opacity: 0.5 },
      { color: '#72ea28', opacity: 0.5 },
      { color: '#ffb314', opacity: 0.5 }
    ]
  };

  let selectedColor = selectedNodesIds.length > 0 ? 'selection' : 'default';
  if (selectedRecolorBy) {
    selectedColor = 'biome';
  }
  return (
    <linearGradient id="animate-gradient" x1="0%" y1="0%" x2="100%" y2="0" spreadMethod="reflect">
      {stops[selectedColor].map((stop, i) => (
        <stop offset={i} stopColor={stop.color} stopOpacity={stop.opacity} />
      ))}
      <animate id="one" attributeName="x1" values="0%;120%" dur="4s" repeatCount="indefinite" />
      <animate id="two" attributeName="x2" values="100%;200%" dur="4s" repeatCount="indefinite" />
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
  size = 3,
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
