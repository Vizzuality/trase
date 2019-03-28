import React from 'react';
import PropTypes from 'prop-types';

import 'react-components/dashboard-element/dashboard-widget/dashboard-widget-tooltip.scss';

class DashboardWidgetTooltip extends React.PureComponent {
  static getTooltipValue(meta, dataKey, payload) {
    const { x, ...keys } = payload.payload || payload;
    const key = dataKey || Object.keys(keys)[0];
    let text = '';
    if (meta && meta[key]) {
      const { tooltip } = meta[key];
      if (tooltip.prefix) {
        text = `${tooltip.prefix} `;
      }
      // TODO use tooltip formatter
      text += payload[key] && payload[key].toLocaleString(undefined, { maximumFractionDigits: 0 });
      if (tooltip.suffix || (meta.yAxis && meta.yAxis.suffix)) {
        // TODO temporary fallback, suffix should be taken from tooltip always
        const suffix = tooltip.suffix || meta.yAxis.suffix;
        text += ` ${suffix}`;
      }
    } else if (meta && !meta[key]) {
      text = payload[key] && payload[key].toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
    return text;
  }

  static getTooltipLabel(meta, key, payload) {
    let text = '';
    if (meta && meta[key]) {
      const { label } = meta[key];
      text = `${label} `;
    } else {
      text = payload.y ? `${payload.y} ` : `${payload.x} `;
    }
    return text;
  }

  render() {
    const { payload, meta } = this.props;
    return (
      <div className="c-dashboard-widget-tooltip">
        {payload.map(item => (
          <div className="dashboard-widget-key-item" key={item.name}>
            <span
              style={{
                backgroundColor: item.color || (item.payload && item.payload.fill) || 'white'
              }}
            />
            <p>
              <span>
                {DashboardWidgetTooltip.getTooltipLabel(meta, item.dataKey, item.payload)}
              </span>
              <span className="key-item-value">
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
