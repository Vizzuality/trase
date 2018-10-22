import React from 'react';
import PropTypes from 'prop-types';

class DashboardWidgetTooltip extends React.PureComponent {
  static getTooltipValue(meta, key, payload) {
    let text = '';
    if (meta && meta[key]) {
      const { tooltip } = meta[key];
      if (tooltip.prefix) {
        text = `${tooltip.prefix} `;
      }
      // TODO use tooltip formatter
      text += payload[key] && payload[key].toLocaleString();
      if (tooltip.suffix) {
        text += ` ${tooltip.suffix}`;
      }
    } else if (meta && !meta[key]) {
      text = payload[key] && payload[key].toLocaleString();
    }
    return text;
  }

  static getTooltipLabel(meta, key) {
    let text = '';
    if (meta && meta[key]) {
      const { label } = meta[key];
      text = label;
    }
    return text;
  }

  render() {
    const { payload, meta } = this.props;
    return (
      <div className="c-dashboard-widget-tooltip">
        {payload.map(item => (
          <div className="dashboard-widget-key-item">
            <span style={{ backgroundColor: item.color || 'white' }} />
            <p>
              <span>{DashboardWidgetTooltip.getTooltipLabel(meta, item.dataKey)}</span>
              <span>
                {DashboardWidgetTooltip.getTooltipValue(meta, item.dataKey, item.payload)}
              </span>
            </p>
          </div>
        ))}
      </div>
    );
  }
}

DashboardWidgetTooltip.defaultProps = {};

DashboardWidgetTooltip.propTypes = {
  payload: PropTypes.array,
  meta: PropTypes.object
};

export default DashboardWidgetTooltip;
