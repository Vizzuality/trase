import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import { EXPLORE_STEPS } from 'constants';

export const getContexts = state => state.app.contexts || null;
const getSelectedCommodityId = state => state.explore.selectedCommodityId;
const getSelectedCountryId = state => state.explore.selectedCountryId;
const getQuickFacts = state => state.explore.quickFacts;

export const getStep = createSelector(
  [getSelectedCommodityId, getSelectedCountryId],
  (commodityId, countryId) => {
    console.log(commodityId, countryId);
    if (!commodityId) return EXPLORE_STEPS.selectCommodity;
    if (!countryId) return EXPLORE_STEPS.selectCountry;
    return EXPLORE_STEPS.selected;
  }
);

export const getCommodities = createSelector(
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

const getAllCountries = createSelector(
  [getContexts],
  contexts => {
    if (!contexts) return null;
    return uniqBy(
      contexts.map(c => ({
        name: c.countryName,
        id: c.countryId
      })),
      'name'
    );
  }
);

export const getAllCountriesIds = createSelector(
  [getAllCountries],
  countries => (countries ? countries.map(c => c.id) : null)
);

export const getCountries = createSelector(
  [getContexts, getSelectedCommodityId],
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
  [getCommodities, getSelectedCommodityId],
  (commodities, commodityId) => {
    if (!commodityId || !commodities || !commodities.length) return null;
    return commodities.find(c => c.id === commodityId);
  }
);

export const getCommodityContexts = createSelector(
  [getContexts, getCountries, getCommodity],
  (contexts, countries, commodity) => {
    if (!contexts || !commodity) return null;
    const countryIds = countries.map(c => c.id);
    return contexts.filter(c => c.commodityId === commodity.id && countryIds.includes(c.countryId));
  }
);

export const getCountry = createSelector(
  [getCountries, getSelectedCountryId],
  (countries, countryId) => {
    if (!countryId || !countries || !countries.length) return null;
    return countries.find(c => c.id === countryId);
  }
);

export const getItems = createSelector(
  [getStep, getCommodities, getCountries],
  (step, commodities, countries) => {
    if (step === EXPLORE_STEPS.selectCommodity) return commodities;
    if (step === EXPLORE_STEPS.selectCountry) return countries;
    return [];
  }
);

export const getCountryQuickFacts = createSelector(
  [getQuickFacts],
  quickFacts => {
    if (!quickFacts) return null;
    const { data, meta } = quickFacts;
    const countryQuickFacts = {};
    data.forEach(d => {
      const indicators = d.facts.map(i => {
        const indicatorMeta = meta.attributes.find(m => m.id === i.attributeId);
        const { unit, displayName: name, tooltipText: tooltip } = indicatorMeta;
        return { ...i, unit, name, tooltip };
      });
      countryQuickFacts[d.countryId] = indicators;
    });
    return countryQuickFacts;
  }
);

export const getCards = createSelector(
  [getStep],
  () => ({
    [EXPLORE_STEPS.selectCommodity]: [],
    [EXPLORE_STEPS.selectCountry]: [],
    [EXPLORE_STEPS.selected]: []
  })
);
