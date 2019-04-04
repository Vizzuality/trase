import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';
import { CHART_TYPES } from 'constants';

const getMeta = (state, { meta }) => meta || null;
const getData = (state, { data }) => data || null;
const getChartType = (state, { chartType }) => chartType || null;
const returnNameArrayIfNotEmpty = value =>
  isEmpty(value) ? null : Object.values(value).map(v => v.name);
const getCountriesPanel = state =>
  returnNameArrayIfNotEmpty(
    state.dashboardElement && state.dashboardElement.countriesPanel.activeItems
  );
const getCommoditiesPanel = state =>
  returnNameArrayIfNotEmpty(
    state.dashboardElement && state.dashboardElement.commoditiesPanel.activeItems
  );

const getVariableColumnName = createSelector(
  [getMeta],
  meta => (meta.info.node_type === 'COUNTRY' ? 'DESTINATION' : meta.info.node_type)
);

const hasNContIndicator = createSelector(
  [getMeta],
  meta => meta.info.filter.ncont_attribute
);
const hasMultipleYears = createSelector(
  [getMeta],
  meta => meta.info.years.end_year
);
const hasVariableColumn = createSelector(
  [getMeta, getChartType, getVariableColumnName, hasMultipleYears, hasNContIndicator],
  (meta, chartType, variableColumnName, _hasMultipleYears, _hasNContIndicator) =>
    !(_hasNContIndicator && _hasMultipleYears) &&
    !(chartType === 'bar' && _hasMultipleYears) &&
    !(chartType === 'pie') &&
    variableColumnName
);

const getIndicatorColumnName = (meta, type) => {
  const unit = type === 'cont' && (meta.xAxis.suffix || meta.yAxis.suffix);
  return `${meta.info.filter[`${type}_attribute`].toUpperCase()}${unit ? ` (${unit})` : ''}`;
};

const getTableHeaders = createSelector(
  [getMeta, hasVariableColumn, getVariableColumnName, hasNContIndicator],
  (meta, _hasVariableColumn, variableColumnName, _hasNContIndicator) => {
    if (!meta) return null;
    const headers = ['COMMODITY', 'COUNTRY', 'YEAR'];
    if (_hasVariableColumn) headers.push(variableColumnName);
    headers.push(getIndicatorColumnName(meta, 'cont'));
    if (_hasNContIndicator) {
      headers.push(getIndicatorColumnName(meta, 'ncont'));
    }
    return headers;
  }
);

const getYear = (d, meta, chartType) => {
  switch (chartType) {
    case CHART_TYPES.horizontalBar:
    case CHART_TYPES.horizontalStackedBar:
    case CHART_TYPES.pie:
      return meta.info.years.start_year;
    default:
      return d.x || meta.info.years.start_year;
  }
};

const getContValue = (d, c) => d[c] && format(',.2s')(d[c]);
const getNotContValue = (d, c, meta, chartType, _hasMultipleYears) => {
  if (
    chartType === CHART_TYPES.horizontalBar ||
    chartType === CHART_TYPES.horizontalStackedBar ||
    _hasMultipleYears
  ) {
    return meta[c].label && meta[c].label.toUpperCase();
  }
  return d.x && String(d.x).toUpperCase();
};
const getVariableColumnData = (d, c, meta) => d.y || meta[c].label;

const getDataColumnNames = createSelector(
  [getMeta, getChartType],
  (meta, chartType) => {
    const metaColumns = {
      ...meta
    };
    const notColumnKeys = ['info', 'xAxis', 'yAxis'];
    if (chartType === CHART_TYPES.horizontalBar || chartType === CHART_TYPES.horizontalStackedBar) {
      notColumnKeys.push('y');
    } else {
      notColumnKeys.push('x');
    }
    notColumnKeys.forEach(a => delete metaColumns[a]);
    return Object.keys(metaColumns);
  }
);

export const getTableData = createSelector(
  [
    getMeta,
    getData,
    getCountriesPanel,
    getCommoditiesPanel,
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
    dataColumnNames.forEach(c => {
      data.forEach(d => {
        const rowData = [countries[0], commodities[0], getYear(d, meta, chartType)];
        if (_hasVariableColumn) {
          rowData.push(getVariableColumnData(d, c, meta));
        }
        rowData.push(getContValue(d, c));
        if (_hasNContIndicator) {
          rowData.push(getNotContValue(d, c, meta, chartType, _hasMultipleYears));
        }

        parsedData.push(rowData);
      });
    });
    return { headers, data: parsedData };
  }
);
