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
const getSourcesPanel = state =>
  returnNameArrayIfNotEmpty(
    state.dashboardElement && state.dashboardElement.sourcesPanel.activeItems
  );
const getDestinationsPanel = state =>
  returnNameArrayIfNotEmpty(
    state.dashboardElement && state.dashboardElement.destinationsPanel.activeItems
  );
const getCompaniesPanel = state =>
  returnNameArrayIfNotEmpty(
    state.dashboardElement && state.dashboardElement.companiesPanel.activeItems
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

const getYear = (d, meta, chartType) => {
  switch (chartType) {
    case 'horizontalBar':
    case 'stackedHorizontalBar':
      return meta.info.years.start_year;
    default:
      return d.x || meta.info.years.start_year;
  }
};

const getExtraInfo = createStructuredSelector({
  countries: getCountriesPanel,
  sources: getSourcesPanel,
  destinations: getDestinationsPanel,
  companies: getCompaniesPanel,
  commodities: getCommoditiesPanel
});

export const makeGetTableData = () =>
  createSelector(
    [getMeta, getData, getExtraInfo, getChartType],
    (meta, data, info, chartType) => {
      if (!meta || !data) return null;
      console.log(meta, data, info);
      const headers = ['Commodity', 'Country', 'Year'];
      const variableColumn = getVariableColumn(meta);
      const columns = getColumnNames(meta, chartType);
      if (variableColumn) headers.push(variableColumn);
      if (meta.info.filter.cont_attribute) headers.push(meta.info.filter.cont_attribute);
      if (meta.info.filter.n_cont_attribute) headers.push(meta.info.filter.n_cont_attribute);
      console.log('c', data, columns);
      const parsedData = [];
      columns.forEach(c => {
        data.forEach(d => {
          parsedData.push([
            info.commodities[0],
            info.countries[0],
            getYear(d, meta, chartType),
            d.y || console.log(d[c]) || d[c],
            `${d.x0} ${meta.xAxis.suffix}`
          ]);
        });
      });
      return { headers, data: parsedData };
    }
  );
