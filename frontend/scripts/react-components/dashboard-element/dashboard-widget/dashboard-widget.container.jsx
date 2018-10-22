import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DashboardWidget from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.component';
import Widget from 'react-components/widgets/widget.component';
import CHART_CONFIG from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-config';

class DashboardWidgetContainer extends Component {
  static getYKeys(meta, { yKeys, yKeysAttributes, colors }) {
    if (!meta || !yKeys) return yKeys;
    const { xAxis, yAxis, x, ...groupedYKeys } = meta;
    return Object.keys(yKeys).reduce((yKeysTypesAcc, nextYKeyType) => {
      const yKeyTypeAttributes = yKeysAttributes && yKeysAttributes[nextYKeyType];
      return {
        ...yKeysTypesAcc,
        [nextYKeyType]: Object.keys(groupedYKeys).reduce(
          (groupedYKeysAcc, nextGroupedYKey, index) => ({
            [nextGroupedYKey]: {
              ...yKeyTypeAttributes,
              fill: colors && colors[index],
              stroke: colors && colors[index]
            }
          }),
          {}
        )
      };
    }, {});
  }

  getConfig(meta) {
    const { chartType } = this.props;
    const defaultConfig = CHART_CONFIG[chartType];
    if (!meta) return defaultConfig;
    return {
      ...defaultConfig,
      xAxis: {
        ...defaultConfig.xAxis,
        type: meta.x && meta.x.type
      },
      yAxis: {
        ...defaultConfig.yAxis,
        type: meta.y && meta.x.type
      },
      yKeys: DashboardWidgetContainer.getYKeys(meta, defaultConfig)
    };
  }

  render() {
    const { url, title } = this.props;
    return (
      <Widget raw query={[url]} params={[{ title }]}>
        {({ data, loading, error, meta }) => (
          <DashboardWidget
            title={title}
            error={error}
            loading={loading}
            data={data && data[url]}
            chartConfig={this.getConfig(meta && meta[url])}
          />
        )}
      </Widget>
    );
  }
}

DashboardWidgetContainer.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  chartType: PropTypes.string
};

export default DashboardWidgetContainer;
