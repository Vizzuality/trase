import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import { format } from 'd3-format';

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

const getVariableColumn = meta => {
  switch (meta.info.node_type) {
    case 'COUNTRY':
      return 'Destination';
    default:
      return meta.info.node_type;
  }
};

const getColumnNames = (meta, chartType) => {
  const metaColumns = { ...meta };
  const notColumnKeys = ['info', 'xAxis', 'yAxis'];
  if (chartType === 'horizontalBar' || chartType === 'stackedHorizontalBar') {
    notColumnKeys.push('y');
  } else {
    notColumnKeys.push('x');
  }
  return Object.keys(omit(metaColumns, notColumnKeys));
};
const getContValue = (d, c) => d[c] && format(',.2s')(d[c]);

const getYear = (d, meta, chartType) => {
  switch (chartType) {
    case 'horizontalBar':
    case 'stackedHorizontalBar':
    case 'pie':
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
  const unit = type === 'cont_attribute' ? meta.xAxis.suffix : meta.yAxis.suffix;
  return `${meta.info.filter[type].toUpperCase()}${unit ? ` (${unit})` : ''}`;
};

const getVariableColumnName = (d, c, meta) => d.y || meta[c].label;

const getCommodities = info => info.commodities[0];
const getCountries = info => info.countries[0];

export const getTableData = createSelector(
  [getMeta, getData, getExtraInfo, getChartType],
  (meta, data, info, chartType) => {
    if (!meta || !data) return null;
    const headers = ['COMMODITY', 'COUNTRY', 'YEAR'];
    const variableColumn = getVariableColumn(meta);
    const columns = getColumnNames(meta, chartType);
    if (variableColumn) headers.push(variableColumn);
    if (meta.info.filter.cont_attribute)
      headers.push(getIndicatorColumnName(meta, 'cont_attribute'));
    if (meta.info.filter.ncont_attribute)
      headers.push(getIndicatorColumnName(meta, 'ncont_attribute'));
    const parsedData = [];
    columns.forEach(c => {
      data.forEach(d => {
        const rowData = [getCommodities(info), getCountries(info), getYear(d, meta, chartType)];

        if (!(chartType === 'bar' && meta.info.years.end_year)) {
          rowData.push(getVariableColumnName(d, c, meta));
        }
        if (getContValue(d, c, meta)) {
          rowData.push(getContValue(d, c, meta));
        }

        parsedData.push(rowData);
      });
    });
    return { headers, data: parsedData };
  }
);
