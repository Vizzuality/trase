import React from 'react';
import PropTypes from 'prop-types';

import 'styles/components/shared/dropdown-item-legend-summary.scss';

function RecolorByNodeLegendSummary({ recolorGroups }) {
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

RecolorByNodeLegendSummary.propTypes = {
  recolorGroups: PropTypes.array
};

export default RecolorByNodeLegendSummary;
