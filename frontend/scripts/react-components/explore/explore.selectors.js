import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import { EXPLORE_STEPS } from 'constants';

export const getContexts = state => state.app.contexts || null;
const getSelectedCommodityId = state => state.explore.selectedCommodityId;
const getSelectedCountryId = state => state.explore.selectedCountryId;

export const getStep = createSelector(
  [getSelectedCommodityId, getSelectedCountryId],
  (commodityId, countryId) => {
    if (!commodityId) return EXPLORE_STEPS.selectCommodity;
    if (!countryId) return EXPLORE_STEPS.selectCountry;
    return EXPLORE_STEPS.selected;
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

const getCountries = createSelector(
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

export const getCards = createSelector(
  [getCommodity, getCountry, getCommodities, getAllCountries, getContexts],
  (commodity, country, allCommodities, allCountries, contexts) => {
    const nodeTypes = [{ id: 1, name: 'EXPORTER' }, { id: 2, name: 'COUNTRY' }];
    const mockedCards = [
      { commodity_id: 1, country_id: 27, indicator_id: 32, node_type_id: 1 },
      { commodity_id: 1, country_id: 27, indicator_id: 32, node_type_id: 2 },
      { commodity_id: 1, country_id: 27, indicator_id: 32, node_type_id: 3 },
      { commodity_id: 1, country_id: 27, indicator_id: 33, node_type_id: 4 }
    ];
    const getUpdatedCard = card => {
      let commodityName = commodity?.name;
      if (!commodityName) {
        const cardCommodity = allCommodities.find(c => c.id === card.commodity_id);
        commodityName = cardCommodity?.name;
      }
      let countryName = country?.name;
      if (!countryName) {
        const cardCountry = allCountries.find(c => c.id === card.country_id);
        countryName = cardCountry?.name;
      }

      const cardContext = contexts.find(
        c => c.commodityId === card.commodity_id && c.countryId === card.country_id
      );

      const indicator = cardContext?.recolorBy.find(i => i.attributeId === card.indicator_id);
      const nodeType = nodeTypes.find(i => i.id === card.node_type_id);

      return {
        commodityId: commodity ? commodity.id : card.commodity_id,
        commodityName,
        countryId: country ? country.id : card.country_id,
        countryName,
        indicatorId: card.indicator_id,
        indicatorName: indicator?.name,
        nodeTypeId: card.node_type_id,
        nodeTypeName: nodeType?.name,
        key: `${commodityName}-${countryName}-${indicator?.name}-${nodeType?.name}`
      };
    };
    const updatedCards = mockedCards.map(mockedCard => getUpdatedCard(mockedCard));
    return {
      [EXPLORE_STEPS.selectCommodity]: updatedCards,
      [EXPLORE_STEPS.selectCountry]: updatedCards,
      [EXPLORE_STEPS.selected]: updatedCards
    };
  }
);
