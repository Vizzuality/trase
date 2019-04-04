import { createSelector, createStructuredSelector } from 'reselect';
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

const getVariableColumn = meta =>
  meta.info.node_type === 'COUNTRY' ? 'DESTINATION' : meta.info.node_type;

const getColumnNames = (meta, chartType) => {
  const metaColumns = { ...meta };
  const notColumnKeys = ['info', 'xAxis', 'yAxis'];
  if (chartType === CHART_TYPES.horizontalBar || chartType === CHART_TYPES.horizontalStackedBar) {
    notColumnKeys.push('y');
  } else {
    notColumnKeys.push('x');
  }
  notColumnKeys.forEach(a => delete metaColumns[a]);
  return Object.keys(metaColumns);
};

const getContValue = (d, c) => d[c] && format(',.2s')(d[c]);

const getNotContValue = (d, c, meta, chartType, hasMultipleYears) => {
  if (
    chartType === CHART_TYPES.horizontalBar ||
    chartType === CHART_TYPES.horizontalStackedBar ||
    hasMultipleYears
  ) {
    return meta[c].label && meta[c].label.toUpperCase();
  }
  return d.x && String(d.x).toUpperCase();
};

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

const getExtraInfo = createStructuredSelector({
  countries: getCountriesPanel,
  commodities: getCommoditiesPanel
});

const getIndicatorColumnName = (meta, type) => {
  const unit = type === 'cont_attribute' && (meta.xAxis.suffix || meta.yAxis.suffix);
  return `${meta.info.filter[type].toUpperCase()}${unit ? ` (${unit})` : ''}`;
};

const getVariableColumnData = (d, c, meta) => d.y || meta[c].label;

const getCommodities = info => info.commodities[0];
const getCountries = info => info.countries[0];

export const getTableData = createSelector(
  [getMeta, getData, getExtraInfo, getChartType],
  (meta, data, info, chartType) => {
    if (!meta || !data) return null;
    const hasNContIndicator = meta.info.filter.ncont_attribute;
    const hasMultipleYears = meta.info.years.end_year;
    const variableColumn = getVariableColumn(meta);
    const hasVariableColumn =
      !(hasNContIndicator && hasMultipleYears) &&
      !(chartType === 'bar' && hasMultipleYears) &&
      !(chartType === 'pie') &&
      variableColumn;

    // Headers
    const headers = ['COMMODITY', 'COUNTRY', 'YEAR'];
    const columns = getColumnNames(meta, chartType);
    if (hasVariableColumn) headers.push(variableColumn);
    headers.push(getIndicatorColumnName(meta, 'cont_attribute'));
    if (hasNContIndicator) {
      headers.push(getIndicatorColumnName(meta, 'ncont_attribute'));
    }

    // Data
    const parsedData = [];
    console.log(columns, data, meta);
    columns.forEach(c => {
      data.forEach(d => {
        const rowData = [getCommodities(info), getCountries(info), getYear(d, meta, chartType)];
        if (hasVariableColumn) {
          rowData.push(getVariableColumnData(d, c, meta));
        }
        rowData.push(getContValue(d, c));
        if (hasNContIndicator)
          rowData.push(getNotContValue(d, c, meta, chartType, hasMultipleYears));
        parsedData.push(rowData);
      });
    });
    return { headers, data: parsedData };
  }
);
