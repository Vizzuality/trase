import React from 'react';
import PropTypes from 'prop-types';
import './logistic-legend.styles.scss';
import Dropdown from 'react-components/shared/dropdown';

function LogisticLegend({
  layers,
  inspectionLevelOptions,
  selectedInspectionLevel,
  setLogisticInspectionLevel
}) {
  if (!layers.length) return null;
  return (
    <div className="c-logistic-legend cartodb-legend custom">
      <div className="title bullets">{layers[0].categoryName}</div>
      {selectedInspectionLevel && (
        <div className="title bullets">
          Inspection level:
          <Dropdown
            options={inspectionLevelOptions}
            value={selectedInspectionLevel}
            onChange={(selected) => setLogisticInspectionLevel(selected.value)}
            variant="legend"
            placement="top-end"
          />
        </div>
      )}
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
  inspectionLevelOptions: PropTypes.array,
  selectedInspectionLevel: PropTypes.object,
  setLogisticInspectionLevel: PropTypes.func,
  layers: PropTypes.array
};

export default LogisticLegend;