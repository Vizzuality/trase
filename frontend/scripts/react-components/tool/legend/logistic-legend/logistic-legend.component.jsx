import React from 'react';
import PropTypes from 'prop-types';
import './logistic-legend.styles.scss';

function LogisticLegend({ layers }) {
  if (!layers.length) return null;
  return (
    <div className="c-logistic-legend cartodb-legend custom">
      <div className="title bullets">
        {layers[0].categoryName}
      </div>
      <div className="title bullets">
        Inspection level:
      </div>
      <ul className="bullets">
        {layers.map(l => (
          <li className="bkg">
            <div className="bullet" style={{ backgroundColor: l.color }} />
            {l.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

LogisticLegend.propTypes = {
  layers: PropTypes.array
};

export default LogisticLegend;