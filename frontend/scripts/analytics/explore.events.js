import {
  EXPLORE__SET_COMMODITY,
  EXPLORE__SET_COUNTRY,
  EXPLORE__SELECT_TOP_CARD
} from 'react-components/explore/explore.actions';

export default [
  {
    type: EXPLORE__SET_COMMODITY,
    category: 'explore',
    action: 'Select commodity',
    shouldSend(action) {
      const {
        payload: { selectedCommodityId }
      } = action;
      return !!selectedCommodityId;
    },
    getPayload(action, state) {
      const {
        payload: { selectedCommodityId }
      } = action;

      const { contexts } = state.app;
      const commodityContext = contexts.find(c => c.commodityId === selectedCommodityId);

      return commodityContext
        ? `${commodityContext.commodityName}`
        : 'No commodity selected (error: unexpected state)';
    }
  },
  {
    type: EXPLORE__SET_COUNTRY,
    category: 'explore',
    action: 'Select country',
    shouldSend(action) {
      const {
        payload: { selectedCountryId }
      } = action;
      return !!selectedCountryId;
    },
    getPayload(action, state) {
      const {
        payload: { selectedCountryId }
      } = action;

      const { contexts } = state.app;
      const { selectedCommodityId } = state.explore;
      const context = contexts.find(
        c => c.countryId === selectedCountryId && c.commodityId === selectedCommodityId
      );

      return context
        ? `${context.countryName} from ${context.commodityName}`
        : 'No context selected (error: unexpected state)';
    }
  },
  {
    type: EXPLORE__SELECT_TOP_CARD,
    category: 'explore',
    action: 'Select top card',
    getPayload(action) {
      const {
        payload: { linkParams }
      } = action;
      const { commodityId, countryId, title, subtitle } = linkParams;
      return `commodity: ${commodityId} - country: ${countryId} - ${title} - ${subtitle}`;
    }
  }
];
