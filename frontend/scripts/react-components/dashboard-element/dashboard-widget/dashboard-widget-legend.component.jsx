import React from 'react';
import PropTypes from 'prop-types';

class DashboardWidgetLegend extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired
  };

  render() {
    return (
      <div className="c-dashboard-widget-legend" />
    );
  }
}

export default DashboardWidgetLegend;
