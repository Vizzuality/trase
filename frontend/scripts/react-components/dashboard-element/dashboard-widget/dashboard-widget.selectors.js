import { createSelector } from 'reselect';
import omitBy from 'lodash/omitBy';
import sortBy from 'lodash/sortBy';
import kebabCase from 'lodash/kebabCase';
import capitalize from 'lodash/capitalize';
import addApostrophe from 'utils/addApostrophe';
import { getChartConfig } from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-config';
import { CHART_TYPES, NODE_TYPE_PANELS } from 'constants';
import {
  getDashboardsContext,
  getDashboardSelectedRecolorBy
} from 'react-components/dashboard-element/dashboard-element.selectors';
import { getSelectedRecolorBy } from 'react-components/tool-links/tool-links.selectors';
import { getSelectedContext } from 'reducers/app.selectors';
import pluralize from 'utils/pluralize';

export const PARSED_CHART_TYPES = {
  bar_chart: CHART_TYPES.bar,
  donut_chart: CHART_TYPES.pie,
  ranking_chart: CHART_TYPES.ranking,
  stacked_bar_chart: CHART_TYPES.stackedBar,
  dynamic_sentence: CHART_TYPES.dynamicSentence,
  horizontal_bar_chart: CHART_TYPES.horizontalBar,
  horizontal_stacked_bar_chart: CHART_TYPES.horizontalStackedBar
};

const getPage = state => state.location.type;

const getChartVariant = (state, { variant }) => variant;
const getMeta = (state, { meta }) => meta || null;
const getData = (state, { data }) => data || null;
const getGrouping = (state, { grouping }) => grouping || null;
const getActiveChartId = (state, { activeChartId }) => {
  if (typeof activeChartId !== 'undefined' && activeChartId !== null) {
    return activeChartId;
  }
  return null;
};
export const getChartType = (state, { chartType, meta }) => {
  if (chartType) {
    const type = PARSED_CHART_TYPES[chartType];
    if (type === CHART_TYPES.dynamicSentence && typeof meta?.info?.filter?.node !== 'undefined') {
      return CHART_TYPES.nodeIndicatorSentence;
    }
    return type;
  }
  return null;
};

export const getDefaultConfig = createSelector(
  [getChartType, getChartVariant],
  (chartType, variant) => getChartConfig(variant)[chartType] || getChartConfig(variant).bar
);

const getGroupedAxis = (axis, meta) => {
  const toBeRemoved = axis === 'y' ? 'x' : 'y';
  const sanitizedGroupedAxis = omitBy(
    meta,
    (value, key) => !/^(x|y){1}[0-9]*$/.test(key) || key === toBeRemoved
  );
  return sanitizedGroupedAxis;
};

const sortGroupedAxis = keys => sortBy(Object.keys(keys), key => parseInt(key.substr(1), 10));

const getConfigRecolorBy = createSelector(
  [getSelectedRecolorBy, getDashboardSelectedRecolorBy, getPage],
  (selectedRecolorBy, dashboardRecolorBy, page) => {
    if (page === 'tool') {
      return selectedRecolorBy;
    }
    return dashboardRecolorBy;
  }
);

export const getColors = createSelector(
  [getMeta, getData, getDefaultConfig, getChartType, getConfigRecolorBy],
  (meta, data, defaultConfig, chartType, selectedRecolorBy) => {
    const { colors, layout, parse } = defaultConfig;

    if (!parse || !meta) {
      return colors && colors.default;
    }

    const getColor = labelText => {
      const legendKey = labelText && kebabCase(labelText);
      const type = selectedRecolorBy && selectedRecolorBy.legendType;
      const theme = selectedRecolorBy && selectedRecolorBy.legendColorTheme;
      const colorName = `recolorby-${type}-${theme}-${legendKey}`;

      return selectedRecolorBy && colors[colorName];
    };

    if (chartType !== 'pie') {
      const continuousAxis = layout === 'vertical' ? 'x' : 'y';
      const groupedAxis = getGroupedAxis(continuousAxis, meta);
      return sortGroupedAxis(groupedAxis).map((key, index) => {
        const label = groupedAxis[key].label || meta[`${continuousAxis}Axis`].label;
        const color = getColor(label);
        return {
          label,
          color: color || colors[`recolorgroup-${index + 1}`]
        };
      });
    }

    return data.map((item, index) => {
      const color = getColor(item.x);
      return {
        label: item.x,
        color: color || (colors && colors[`recolorgroup-${index + 1}`])
      };
    });
  }
);

export const getYKeys = createSelector(
  [getMeta, getDefaultConfig, getColors],
  (meta, defaultConfig, colors) => {
    const { yKeys, yKeysAttributes, layout, parse } = defaultConfig;
    if (!parse || !meta || !yKeys || layout === 'vertical') return yKeys;
    const groupedY = getGroupedAxis('y', meta);
    return Object.keys(yKeys).reduce((yKeysTypesAcc, nextYKeyType) => {
      const yKeyTypeAttributes = yKeysAttributes && yKeysAttributes[nextYKeyType];
      return {
        ...yKeysTypesAcc,
        [nextYKeyType]: sortGroupedAxis(groupedY).reduce(
          (groupedYKeysAcc, nextGroupedYKey, index) => ({
            ...groupedYKeysAcc,
            [nextGroupedYKey]: {
              ...yKeyTypeAttributes,
              fill: colors && colors[index] && colors[index].color,
              stroke: colors && colors[index] && colors[index].color
            }
          }),
          {}
        )
      };
    }, {});
  }
);

export const getXKeys = createSelector(
  [getMeta, getDefaultConfig, getColors],
  (meta, defaultConfig, colors) => {
    const { xKeys, xKeysAttributes, layout, parse } = defaultConfig;
    if (!parse || !meta || !xKeys || layout !== 'vertical') return xKeys;
    const groupedX = getGroupedAxis('x', meta);
    return Object.keys(xKeys).reduce((xKeysTypesAcc, nextXKeyType) => {
      const xKeyTypeAttributes = xKeysAttributes && xKeysAttributes[nextXKeyType];
      return {
        ...xKeysTypesAcc,
        [nextXKeyType]: sortGroupedAxis(groupedX).reduce(
          (groupedXKeysAcc, nextGroupedXKey, index) => ({
            ...groupedXKeysAcc,
            [nextGroupedXKey]: {
              ...xKeyTypeAttributes,
              fill: colors && colors[index] && colors[index].color,
              stroke: colors && colors[index] && colors[index].color
            }
          }),
          {}
        )
      };
    }, {});
  }
);

const getConfigContext = createSelector(
  [getSelectedContext, getDashboardsContext, getPage],
  (selectedContext, dashboardContext, page) => {
    if (page === 'tool') {
      return selectedContext;
    }
    return dashboardContext;
  }
);

export const makeGetConfig = () =>
  createSelector(
    [getMeta, getYKeys, getXKeys, getColors, getDefaultConfig, getConfigContext],
    (meta, yKeys, xKeys, colors, defaultConfig, context) => {
      if (!meta) return defaultConfig;
      const config = {
        ...defaultConfig,
        xAxis: defaultConfig.xAxis && {
          ...defaultConfig.xAxis,
          type: meta.xAxis && meta.xAxis.type
        },
        xAxisLabel: {
          text: meta.xAxis && meta.xAxis.label,
          suffix: meta.xAxis && meta.xAxis.suffix
        },
        yAxis: defaultConfig.yAxis && {
          ...defaultConfig.yAxis,
          type: meta.yAxis && meta.yAxis.type
        },
        yAxisLabel: {
          text: meta.yAxis && meta.yAxis.label,
          suffix: meta.yAxis && meta.yAxis.suffix
        },
        tooltip: {
          ...defaultConfig.tooltip
        },
        yKeys,
        xKeys,
        colors,
        dashboardMeta: { context }
      };
      return config;
    }
  );

const getNodeTypeName = pluralNodeType =>
  pluralNodeType === 'countries' ? 'importing countries' : pluralNodeType;

export const makeGetGroupingActiveItem = () =>
  createSelector([getGrouping, getActiveChartId], (grouping, activeChartId) => {
    if (activeChartId && grouping) {
      const item = grouping.options.find(option => option.id === activeChartId);
      return { ...item, value: item.id, label: capitalize(item.label) };
    }
    return null;
  });

export const makeGetGroupingOptions = () =>
  createSelector([getGrouping], grouping => {
    if (grouping) {
      return sortBy(grouping.options, ['label']).map(option => ({
        ...option,
        value: option.id,
        label: capitalize(option.label)
      }));
    }
    return null;
  });

export const makeGetTitle = () =>
  createSelector(
    [getMeta, makeGetGroupingActiveItem(), makeGetConfig()],
    (meta, activeChartGrouping, config) => {
      if (!meta || !meta.info) return '';
      // adding 1 to the top_n to count in "other" aggregation
      let topNPart = meta.info.top_n ? `Top ${meta.info.top_n + 1}` : null;
      let nodeTypePart = 'Selection overview';
      const nodeFilter = meta.info?.filter?.node;
      const nodeType = meta.info.node_type;
      if (nodeType) {
        nodeTypePart = getNodeTypeName(pluralize(nodeType));
      } else if (nodeFilter) {
        const label = activeChartGrouping ? '' : config?.yAxisLabel.text;
        nodeTypePart = `${capitalize(nodeFilter.name)}${addApostrophe(nodeFilter.name)} ${label}`;
      }

      let filterPart = '';
      const filterKey = meta.info.single_filter_key;
      if (filterKey) {
        const name = activeChartGrouping ? '' : capitalize(meta.info.filter[filterKey][0].name);
        filterPart = `of ${name}`;
      }

      const nodeStep = NODE_TYPE_PANELS[nodeType];
      const isNodeComparison =
        meta.info.filter &&
        meta.info.filter[nodeStep] &&
        meta.info.filter[nodeStep].length &&
        meta.info.filter[nodeStep].map(f => f.node_type === nodeType).filter(Boolean).length > 1;
      if (isNodeComparison) {
        topNPart = null;
        nodeTypePart = capitalize(nodeTypePart);
        filterPart = 'comparison';
      }

      return [topNPart, nodeTypePart, filterPart].filter(Boolean).join(' ');
    }
  );
