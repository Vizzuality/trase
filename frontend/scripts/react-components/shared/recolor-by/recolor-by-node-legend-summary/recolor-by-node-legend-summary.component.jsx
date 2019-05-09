import React from 'react';
import PropTypes from 'prop-types';

import './recolor-by-item-legend-summary.scss';

function RecolorByNodeLegendSummary({ recolorGroups }) {
  if (!recolorGroups) {
    return null;
  }

  return (
    <div className="recolor-by-item-legend-summary">
      {Object.values(recolorGroups).map((color, key) => (
        <div key={key} className={`color -recolorgroup-${color}`} style={{ order: color }} />
      ))}
    </div>
  );
}

RecolorByNodeLegendSummary.propTypes = {
  recolorGroups: PropTypes.array
};

export default RecolorByNodeLegendSummary;
