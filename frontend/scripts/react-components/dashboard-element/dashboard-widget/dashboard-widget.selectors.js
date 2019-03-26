import { createSelector } from 'reselect';

import sortBy from 'lodash/sortBy';
import CHART_CONFIG from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-config';

const parsedChartTypes = {
  dynamic_sentence: 'dynamicSentence',
  bar_chart: 'bar',
  stacked_bar_chart: 'stackedBar',
  horizontal_bar_chart: 'HorizontalBar',
  stacked_horizontal_bar_chart: 'stackedHorizontalBar',
  donut_chart: 'pie'
};

const getMeta = (state, { meta }) => meta || null;
const getData = (state, { data }) => data || null;
const getChartType = (state, { chartType }) => (chartType ? parsedChartTypes[chartType] : null);
export const getDefaultConfig = createSelector(
  [getChartType],
  chartType => CHART_CONFIG[chartType] || CHART_CONFIG.bar
);

const getGroupedY = meta => {
  const { xAxis, yAxis, x, ...groupedY } = meta;
  return groupedY;
};

const sortGroupedY = keys => sortBy(Object.keys(keys), key => parseInt(key.substr(1), 10));

export const getYKeys = createSelector(
  [getMeta, getDefaultConfig],
  (meta, defaultConfig) => {
    const { yKeys, yKeysAttributes, colors } = defaultConfig;
    if (!meta || !yKeys) return yKeys;
    const groupedY = getGroupedY(meta);
    return Object.keys(yKeys).reduce((yKeysTypesAcc, nextYKeyType) => {
      const yKeyTypeAttributes = yKeysAttributes && yKeysAttributes[nextYKeyType];
      return {
        ...yKeysTypesAcc,
        [nextYKeyType]: sortGroupedY(groupedY).reduce(
          (groupedYKeysAcc, nextGroupedYKey, index) => ({
            ...groupedYKeysAcc,
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
);

export const getColors = createSelector(
  [getMeta, getData, getDefaultConfig, getChartType],
  (meta, data, defaultConfig, chartType) => {
    const { colors } = defaultConfig;
    if (!meta || chartType === 'dynamicSentence') return colors;
    if (chartType !== 'pie') {
      const groupedY = getGroupedY(meta);
      return sortGroupedY(groupedY).map((key, index) => ({
        label: groupedY[key].label || meta.yAxis.label,
        color: colors[index]
      }));
    }
    return data.map((item, index) => ({
      label: item.x,
      color: colors[index]
    }));
  }
);

export const makeGetConfig = () =>
  createSelector(
    [getMeta, getYKeys, getColors, getDefaultConfig],
    (meta, yKeys, colors, defaultConfig) => {
      if (!meta) return defaultConfig;
      const config = {
        ...defaultConfig,
        xAxis: defaultConfig.xAxis && {
          ...defaultConfig.xAxis,
          type: meta.x && meta.x.type
        },
        yAxis: defaultConfig.yAxis && {
          ...defaultConfig.yAxis,
          type: meta.y && meta.x.type
        },
        yAxisLabel: {
          text: meta.yAxis && meta.yAxis.label,
          suffix: meta.yAxis && meta.yAxis.suffix
        },
        yKeys,
        colors,
        tooltip: {
          ...defaultConfig.tooltip
        }
      };
      return config;
    }
  );
