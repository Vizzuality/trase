import React from 'react';
import PropTypes from 'prop-types';

export default function recolorByNodeLegendSummary({ recolorGroups }) {
  if (recolorGroups === undefined) {
    return null;
  }

  return (
    <div className="dropdown-item-legend-summary">
      {recolorGroups.map((color, key) => (
        <div key={key} className={`color -recolorgroup-${color}`} style={{ order: color }} />
      ))}
    </div>
  );
}

recolorByNodeLegendSummary.propTypes = {
  recolorGroups: PropTypes.array
};
