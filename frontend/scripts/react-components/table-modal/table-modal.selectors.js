import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

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
  notColumnKeys.forEach(a => delete metaColumns[a]);
  return Object.keys(metaColumns);
};
const getContValue = (d, c) => d[c];

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

export const makeGetTableData = () =>
  createSelector(
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
          parsedData.push([
            info.commodities[0],
            info.countries[0],
            getYear(d, meta, chartType),
            getVariableColumnName(d, c, meta),
            getContValue(d, c, meta)
          ]);
        });
      });
      return { headers, data: parsedData };
    }
  );
