import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import { getSelectedContext } from 'reducers/app.selectors';

const getAppContexts = state => state.app.contexts;
const getDataPortalExporters = state => state.data.exporters;
const getDataPortalIndicators = state => state.data.indicators;
const getDataPortalConsumptionCountries = state => state.data.consumptionCountries;

export const getEnabledContexts = createSelector([getAppContexts], contexts =>
  contexts.filter(elem => elem.isDisabled !== true)
);

export const getCountryOptions = createSelector([getEnabledContexts], enabledContexts =>
  uniqBy(enabledContexts, context => context.countryId).map(context => ({
    id: context.countryId,
    name: context.countryName.toLowerCase(),
    noSelfCancel: true
  }))
);

export const getCommodityOptions = createSelector(
  [getEnabledContexts, getSelectedContext],
  (enabledContexts, selectedContext) =>
    enabledContexts
      .filter(context => context.countryId === selectedContext.countryId)
      .map(context => ({
        id: context.id,
        name: context.commodityName.toLowerCase(),
        noSelfCancel: false
      }))
);

export const getYearOptions = createSelector([getSelectedContext], selectedContext => {
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
