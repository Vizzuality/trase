import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import uniq from 'lodash/uniq';

export const getContexts = state => state.app.contexts || null;
const getActiveCommodityId = state => state.toolSelector.activeCommodityId;
const getActiveCountryId = state => state.toolSelector.activeCountryId;

export const getStep = createSelector(
  [getActiveCommodityId, getActiveCountryId],
  (commodityId, countryId) => {
    if (!commodityId) return 0;
    if (!countryId) return 1;
    return 2;
  }
);

const getCommodities = createSelector(
  [getContexts],
  contexts => {
    if (!contexts) return null;
    return uniqBy(
      contexts.map(c => ({
        name: c.commodityName,
        id: c.commodityId
      })),
      'name'
    );
  }
);

export const getAllCountriesIds = createSelector(
  [getContexts],
  contexts => {
    if (!contexts) return null;
    return uniq(contexts.map(c => c.countryId));
  }
);

const getCountries = createSelector(
  [getContexts, getActiveCommodityId],
  (contexts, commodityId) => {
    if (!contexts) return null;
    return contexts
      .filter(c => c.commodityId === commodityId)
      .map(c => ({
        name: c.countryName,
        id: c.countryId
      }));
  }
);

export const getCommodity = createSelector(
  [getCommodities, getActiveCommodityId],
  (commodities, commodityId) => {
    if (!commodityId || !commodities || !commodities.length) return null;
    return commodities.find(c => c.id === commodityId);
  }
);

export const getCountry = createSelector(
  [getCountries, getActiveCountryId],
  (countries, countryId) => {
    if (!countryId || !countries || !countries.length) return null;
    return countries.find(c => c.id === countryId);
  }
);

export const getItems = createSelector(
  [getStep, getCommodities, getCountries],
  (step, commodities, countries) => {
    if (step === 0) return commodities;
    if (step === 1) return countries;
    return [];
  }
);
