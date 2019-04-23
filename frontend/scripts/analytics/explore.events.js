import { EXPLORE__SET_TOP_COUNTRIES } from 'react-components/explore/explore.actions';

export default [
  {
    type: EXPLORE__SET_TOP_COUNTRIES,
    action(_, state) {
      const { type } = state.location;
      return `Toggle context (${type})`;
    },
    category: 'explore',
    getPayload(action, state) {
      const {
        payload: { data }
      } = action;
      const { contexts, selectedYears } = state.app;
      const { topNodes } = state.explore;
      const context = contexts.find(ctx => ctx.id === data.context_id);
      const selection = context
        ? `${context.countryName} - ${context.commodityName} - ${selectedYears}`
        : 'No context selected (error: unexpected state)';

      const topNodesKeys = Object.keys(topNodes);
      if (
        topNodesKeys.length === 0 ||
        (topNodesKeys.length === 1 && !topNodesKeys[0].includes('country'))
      ) {
        // initial load - doesnt correspond to user interaction
        return `Default state (${selection})`;
      }

      return selection;
    }
  }
];
