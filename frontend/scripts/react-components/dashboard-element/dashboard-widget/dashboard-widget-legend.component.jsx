import React from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash/uniqBy'

class DashboardWidgetLegend extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired
  };

  getClasses() {
    const { data } = this.props;
    return uniqBy(data, item => item.x);
  }

  render() {
    const colorClasses = this.getClasses();
    return (
      <div className="c-dashboard-widget-legend">
        <div className="row -equal-height">
          {colorClasses.map(d => (
            <div className="column small-4">
              <div className="dashboard-widget-legend-item">
                <span style={{ backgroundColor: d.color }} />
                <p>{d.colorClass}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default DashboardWidgetLegend;
