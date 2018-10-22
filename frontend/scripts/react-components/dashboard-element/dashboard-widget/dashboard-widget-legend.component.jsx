import React from 'react';
import PropTypes from 'prop-types';

function DashboardWidgetLegend(props) {
  const { colors } = props;
  console.log(colors);
  return (
    <div className="c-dashboard-widget-legend">
      <div className="row -equal-height">
        {colors.map((d, i) => (
          <div key={i} className="column small-4">
            <div className="dashboard-widget-legend-item">
              <span style={{ backgroundColor: d.color || 'white' }} />
              <p>{d.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

DashboardWidgetLegend.propTypes = {
  colors: PropTypes.array.isRequired
};

export default DashboardWidgetLegend;
