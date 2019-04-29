import { EXPLORE__SET_TOP_COUNTRIES } from 'react-components/explore/explore.actions';

export default [
  {
    type: EXPLORE__SET_TOP_COUNTRIES,
    action(_, state) {
      const { type } = state.location;
      return `Toggle context (${type})`;
    },
    category: 'explore',
    shouldSend(action, state) {
      const { topNodes } = state.explore;
      const topNodesKeys = Object.keys(topNodes);
      return !(
        topNodesKeys.length === 0 ||
        (topNodesKeys.length === 1 && !topNodesKeys[0].includes('country'))
      );
    },
    getPayload(action, state) {
      const {
        payload: { data }
      } = action;
      const { contexts, selectedYears } = state.app;
      const context = contexts.find(ctx => ctx.id === data.context_id);
      return context
        ? `${context.countryName} - ${context.commodityName} - ${selectedYears}`
        : 'No context selected (error: unexpected state)';
    }
  }
];
