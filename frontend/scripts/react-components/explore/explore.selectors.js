import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import { EXPLORE_STEPS } from 'constants';
import translateLink from 'utils/translateLink';

export const getContexts = state => state.app.contexts || null;
const getSelectedCommodityId = state => state.explore.selectedCommodityId;
const getSelectedCountryId = state => state.explore.selectedCountryId;
const getQuickFacts = state => state.explore.quickFacts;
const getSankeyCards = state => state.explore.sankeyCards;

export const getStep = createSelector(
  [getSelectedCommodityId, getSelectedCountryId],
  (commodityId, countryId) => {
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
  [getSankeyCards, getContexts],
  (cards, contexts) => {
    if (!cards || contexts.length === 0) {
      return [];
    }

    return cards.data.map((options, index) => {
      const context = contexts.find(
        ctx => ctx.countryId === options.countryId && ctx.commodityId === options.commodityId
      );
      return {
        index,
        id: options.id,
        title: options.title,
        subtitle: options.subtitle,
        countryId: options.countryId,
        commodityId: options.commodityId,
        countryName: context.countryName,
        commodityName: context.commodityName,
        links: {
          sankey: translateLink(options, cards.meta),
          dashboard: translateLink(options, cards.meta, 'dashboard')
        }
      };
    });
  }
);
