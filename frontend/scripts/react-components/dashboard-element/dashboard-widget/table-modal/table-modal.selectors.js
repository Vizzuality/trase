import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import { format } from 'd3-format';
import { CHART_TYPES } from 'constants';

const getMeta = (state, { meta }) => meta || null;
const getData = (state, { data }) => data || null;
const getChartType = (state, { chartType }) => chartType || null;
const returnNameArrayIfNotEmpty = value =>
  isEmpty(value) ? null : Object.values(value).map(v => v.name);
const getActiveCountriesNames = state =>
  returnNameArrayIfNotEmpty(
    state.dashboardElement && state.dashboardElement.countriesPanel.activeItems
  );
const getActiveCommoditiesNames = state =>
  returnNameArrayIfNotEmpty(
    state.dashboardElement && state.dashboardElement.commoditiesPanel.activeItems
  );
const getActiveSourcesNames = state =>
  returnNameArrayIfNotEmpty(
    state.dashboardElement && state.dashboardElement.sourcesPanel.activeItems
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
  [getChartType, getVariableColumnName, hasMultipleYears, hasNContIndicator, getActiveSourcesNames],
  (chartType, variableColumnName, _hasMultipleYears, _hasNContIndicator, activeSourcesNames) =>
    !(!activeSourcesNames && _hasNContIndicator && _hasMultipleYears) &&
    !(!activeSourcesNames && chartType === 'bar' && _hasMultipleYears) &&
    !(chartType === 'pie') &&
    variableColumnName
);

const getIndicatorColumnName = (meta, type) => {
  const unit = (type === 'cont' && (meta.xAxis.suffix || meta.yAxis.suffix)) || '';
  return {
    name: meta.info.filter[`${type}_attribute`],
    unit
  };
};

export const getTableHeaders = createSelector(
  [getMeta, hasVariableColumn, getVariableColumnName, hasNContIndicator],
  (meta, _hasVariableColumn, variableColumnName, _hasNContIndicator) => {
    if (!meta) return null;
    const headers = [{ name: 'COMMODITY' }, { name: 'COUNTRY' }, { name: 'YEAR' }];
    if (_hasVariableColumn) headers.push({ name: variableColumnName });
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

const contValue = (d, c) => d[c] && format(',.2s')(d[c]);
const nonContValue = (d, column, meta, chartType, _hasMultipleYears) => {
  if (
    chartType === CHART_TYPES.horizontalBar ||
    chartType === CHART_TYPES.horizontalStackedBar ||
    _hasMultipleYears
  ) {
    return meta[column].label && meta[column].label.toUpperCase();
  }
  return d.x && String(d.x).toUpperCase();
};
const getVariableColumnData = (d, column, meta) => d.y || meta[column].label;

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
    const columns = omit(metaColumns, notColumnKeys);
    return Object.keys(columns);
  }
);

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
      data.forEach(d => {
        const rowData = [countries[0], commodities[0], getYear(d, meta, chartType)];
        if (_hasVariableColumn) {
          rowData.push(getVariableColumnData(d, column, meta));
        }
        rowData.push(contValue(d, column));
        if (_hasNContIndicator) {
          rowData.push(nonContValue(d, column, meta, chartType, _hasMultipleYears));
        }

        parsedData.push(rowData);
      });
    });
    return { headers, data: parsedData };
  }
);
