import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import { logisticLayerTemplates } from '../tool/mapbox-map/layers/logistic-layers';

const getAppContexts = state => state.app.contexts;
const getSelectedCountry = state => state.data.country;
const getSelectedCommodity = state => state.data.commodity;
const getDataPortalExporters = state => state.data.exporters;
const getDataPortalIndicators = state => state.data.indicators;
const getDataPortalConsumptionCountries = state => state.data.consumptionCountries;

export const getEnabledContexts = createSelector([getAppContexts], contexts =>
  contexts.filter(elem => elem.isDisabled !== true)
);

export const getBulkLogisticsData = () => {
  const logisticsData = [];
  Object.keys(logisticLayerTemplates).forEach(country => {
    logisticLayerTemplates[country].forEach(l => {
      logisticsData.push({
        countryName: country,
        commodityName: l.commodityName,
        name: l.name,
        id: l.sqlTable
      });
    })
  });
  return logisticsData;
}

export const getCountryOptions = createSelector([getEnabledContexts], enabledContexts =>
  uniqBy(enabledContexts, context => context.countryId).map(context => ({
    id: context.countryId,
    name: context.countryName.toLowerCase(),
    noSelfCancel: true
  }))
);

export const getCommodityOptions = createSelector(
  [getEnabledContexts, getSelectedCountry],
  (enabledContexts, selectedCountry) =>
    uniqBy(
      enabledContexts.filter(context =>
        selectedCountry ? context.countryId === selectedCountry : true
      ),
      context => context.commodityId
    ).map(context => ({
      id: context.commodityId,
      name: context.commodityName.toLowerCase(),
      noSelfCancel: false
    }))
);

export const getDataDownloadContext = createSelector(
  [getSelectedCountry, getSelectedCommodity, getEnabledContexts],
  (selectedCountry, selectedCommodity, contexts) =>
    contexts.find(
      ctx => ctx.countryId === selectedCountry && ctx.commodityId === selectedCommodity
    ) || null
);

export const getYearOptions = createSelector([getDataDownloadContext], selectedContext => {
  if (selectedContext) {
    return selectedContext.years.map(year => ({
      id: year,
      name: year,
      noSelfCancel: true
    }));
  }
  return [];
});

export const getExporterOptions = createSelector([getDataPortalExporters], exporters =>
  exporters
    .map(exporter => ({
      id: exporter.id,
      name: exporter.name.toLowerCase(),
      noSelfCancel: false
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
);

export const getConsumptionCountryOptions = createSelector(
  [getDataPortalConsumptionCountries],
  consumptionCountries =>
    consumptionCountries
      .map(country => ({
        id: country.id,
        name: country.name.toLowerCase(),
        noSelfCancel: false
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
);

export const getIndicatorOptions = createSelector([getDataPortalIndicators], indicators =>
  indicators
    .map(indicator => ({
      id: indicator.name,
      name: `${indicator.frontendName}${indicator.unit !== null ? `(${indicator.unit})` : ''}`,
      unit: indicator.unit,
      noSelfCancel: false,
      filterName: indicator.frontendName,
      filterOptions: indicator.filterOptions
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
);
