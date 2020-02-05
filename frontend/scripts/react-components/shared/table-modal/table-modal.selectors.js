import { createSelector } from 'reselect';
import omit from 'lodash/omit';
import { CHART_TYPES } from 'constants';
import { getNodesPanelValues } from 'react-components/dashboard-element/dashboard-element.selectors';

const getMeta = (state, { meta }) => meta || null;
const getData = (state, { data }) => data || null;
const getChartType = (state, { chartType }) => chartType || null;

const getActiveCountriesNames = createSelector(getNodesPanelValues, panelsValues =>
  panelsValues.countries ? panelsValues.countries.map(i => i.name) : null
);
const getActiveCommoditiesNames = createSelector(getNodesPanelValues, panelsValues =>
  panelsValues.commodities ? panelsValues.commodities.map(i => i.name) : null
);
const getActiveSourcesNames = createSelector(getNodesPanelValues, panelsValues =>
  panelsValues.sources ? panelsValues.sources.map(i => i.name) : null
);

const getTopNValue = createSelector([getMeta], meta => meta.info.top_n);

const getVariableColumnName = createSelector([getMeta], meta =>
  meta.info.node_type === 'COUNTRY' ? 'importing country' : meta.info.node_type
);

const hasNContIndicator = createSelector([getMeta], meta => meta.info.filter.ncont_attribute);
const hasMultipleYears = createSelector([getMeta], meta => meta.info.years.end_year);
const hasVariableColumn = createSelector(
  [
    getChartType,
    getVariableColumnName,
    hasMultipleYears,
    hasNContIndicator,
    getActiveSourcesNames,
    getTopNValue
  ],
  (
    chartType,
    variableColumnName,
    _hasMultipleYears,
    _hasNContIndicator,
    activeSourcesNames,
    topN
  ) => {
    /* eslint-disable camelcase */
    const noSources_isBarChart_hasMultipleYears =
      !activeSourcesNames && chartType === 'bar' && _hasMultipleYears;
    const isPieChart = chartType === 'pie';

    if (noSources_isBarChart_hasMultipleYears || topN !== null || isPieChart) {
      return variableColumnName;
    }
    return null;
    /* eslint-enable */
  }
);

const getContIndicatorHeader = (meta, chartType) => {
  const numberTypeAxis = meta.yAxis.type === 'number' ? 'yAxis' : 'xAxis';
  return {
    name: String(meta.info.filter.cont_attribute).toLowerCase(),
    unit: chartType === CHART_TYPES.pie ? meta.yAxis.suffix : meta[numberTypeAxis].suffix,
    format: ',.2s'
  };
};

export const getTableHeaders = createSelector(
  [getMeta, hasVariableColumn, getVariableColumnName, hasNContIndicator, getChartType],
  (meta, _hasVariableColumn, variableColumnName, _hasNContIndicator, chartType) => {
    if (!meta) return null;
    const headers = [{ name: 'country' }, { name: 'commodity' }, { name: 'year' }];
    if (_hasVariableColumn) {
      headers.push({ name: String(variableColumnName).toLowerCase() });
    }
    headers.push(getContIndicatorHeader(meta, chartType));
    if (_hasNContIndicator) {
      headers.push({ name: String(meta.info.filter.ncont_attribute).toLowerCase() });
    }
    return headers;
  }
);

const getYear = (item, meta, chartType) => {
  switch (chartType) {
    case CHART_TYPES.horizontalBar:
    case CHART_TYPES.horizontalStackedBar:
    case CHART_TYPES.pie:
      return meta.info.years.start_year;
    default:
      return item.x || meta.info.years.start_year;
  }
};

const nonContValue = (item, column, meta, chartType, _hasMultipleYears) => {
  if (
    chartType === CHART_TYPES.horizontalBar ||
    chartType === CHART_TYPES.horizontalStackedBar ||
    _hasMultipleYears
  ) {
    return meta[column].label && meta[column].label;
  }
  return item.x && String(item.x);
};
const getVariableColumnData = (item, column, meta) => item.y || meta[column].label;

const getDataColumnNames = createSelector([getMeta, getChartType], (meta, chartType) => {
  const metaColumns = {
    ...meta
  };
  const notColumnKeys = ['info', 'xAxis', 'yAxis', 'yLabelsProfileInfo', 'aggregates'];
  if (
    chartType === CHART_TYPES.horizontalBar ||
    chartType === CHART_TYPES.horizontalStackedBar ||
    chartType === CHART_TYPES.ranking
  ) {
    notColumnKeys.push('y');
  } else {
    notColumnKeys.push('x');
  }
  const columns = omit(metaColumns, notColumnKeys);
  return Object.keys(columns);
});

export const getTableData = createSelector(
  [
    getMeta,
    getData,
    getActiveCountriesNames,
    getActiveCommoditiesNames,
    getChartType,
    getTableHeaders,
    getDataColumnNames,
    hasNContIndicator,
    hasVariableColumn,
    hasMultipleYears
  ],
  (
    meta,
    data,
    countries,
    commodities,
    chartType,
    headers,
    dataColumnNames,
    _hasNContIndicator,
    _hasVariableColumn,
    _hasMultipleYears
  ) => {
    if (!meta || !data) return null;
    const parsedData = [];
    dataColumnNames.forEach(column => {
      data.forEach(item => {
        const rowData = [countries[0], commodities[0], getYear(item, meta, chartType)];
        if (_hasVariableColumn) {
          rowData.push(getVariableColumnData(item, column, meta));
        }
        rowData.push(item[column]);
        if (_hasNContIndicator) {
          rowData.push(nonContValue(item, column, meta, chartType, _hasMultipleYears));
        }

        parsedData.push(rowData);
      });
    });
    return { headers, data: parsedData };
  }
);
