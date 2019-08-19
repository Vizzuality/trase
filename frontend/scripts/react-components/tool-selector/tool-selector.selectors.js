import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import { TOOL_SELECTOR_STEPS } from 'constants';

export const getContexts = state => state.app.contexts || null;
const getActiveCommodityId = state => state.toolSelector.activeCommodityId;
const getActiveCountryId = state => state.toolSelector.activeCountryId;

export const getStep = createSelector(
  [getActiveCommodityId, getActiveCountryId],
  (commodityId, countryId) => {
    if (!commodityId) return TOOL_SELECTOR_STEPS.selectCommodity;
    if (!countryId) return TOOL_SELECTOR_STEPS.selectCountry;
    return TOOL_SELECTOR_STEPS.selected;
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
    if (step === TOOL_SELECTOR_STEPS.selectCommodity) return commodities;
    if (step === TOOL_SELECTOR_STEPS.selectCountry) return countries;
    return [];
  }
);

export const getCards = createSelector(
  [getCommodity, getCountry, getCommodities, getAllCountries, getContexts],
  (commodity, country, allCommodities, allCountries, contexts) => {
    const nodeTypes = [{ id: 1, name: 'EXPORTER' }, { id: 2, name: 'COUNTRY' }];
    const mockedCards = [
      { commodity_id: 1, country_id: 27, indicator_id: 32, node_type_id: 1 },
      { commodity_id: 1, country_id: 27, indicator_id: 32, node_type_id: 2 }
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
        nodeTypeName: nodeType?.name
      };
    };
    const updatedCards = mockedCards.map(mockedCard => getUpdatedCard(mockedCard));
    return {
      [TOOL_SELECTOR_STEPS.selectCommodity]: updatedCards,
      [TOOL_SELECTOR_STEPS.selectCountry]: updatedCards,
      [TOOL_SELECTOR_STEPS.selected]: updatedCards
    };
  }
);
