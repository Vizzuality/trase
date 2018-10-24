import React, { Component } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import DashboardWidget from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.component';
import DashboardWidgetTooltip from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-tooltip';
import Widget from 'react-components/widgets/widget.component';
import CHART_CONFIG from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-config';

class DashboardWidgetContainer extends Component {
  static getGroupedY(meta) {
    const { xAxis, yAxis, x, ...groupedY } = meta;
    return groupedY;
  }

  static sortGroupedY(keys) {
    return sortBy(Object.keys(keys), key => parseInt(key.substr(1), 10));
  }

  static getYKeys(meta, { yKeys, yKeysAttributes, colors }) {
    if (!meta || !yKeys) return yKeys;
    const groupedY = DashboardWidgetContainer.getGroupedY(meta);
    return Object.keys(yKeys).reduce((yKeysTypesAcc, nextYKeyType) => {
      const yKeyTypeAttributes = yKeysAttributes && yKeysAttributes[nextYKeyType];
      return {
        ...yKeysTypesAcc,
        [nextYKeyType]: DashboardWidgetContainer.sortGroupedY(groupedY).reduce(
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

  static getColors(meta, { colors }) {
    if (!meta) return colors;
    const groupedY = DashboardWidgetContainer.getGroupedY(meta);
    return DashboardWidgetContainer.sortGroupedY(groupedY).map((key, index) => ({
      label: groupedY[key].label || meta.yAxis.label,
      color: colors[index]
    }));
  }

  getConfig(meta) {
    const { chartType } = this.props;
    const defaultConfig = CHART_CONFIG[chartType];
    if (!meta) return defaultConfig;
    const config = {
      ...defaultConfig,
      xAxis: {
        ...defaultConfig.xAxis,
        type: meta.x && meta.x.type
      },
      yAxis: {
        ...defaultConfig.yAxis,
        type: meta.y && meta.x.type
      },
      yAxisLabel: {
        text: meta.yAxis && meta.yAxis.label,
        suffix: meta.yAxis && meta.yAxis.suffix
      },
      yKeys: DashboardWidgetContainer.getYKeys(meta, defaultConfig),
      colors: DashboardWidgetContainer.getColors(meta, defaultConfig),
      tooltip: {
        ...defaultConfig.tooltip,
        content: <DashboardWidgetTooltip meta={meta} />
      }
    };
    return config;
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
            topLegend={meta && meta}
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
