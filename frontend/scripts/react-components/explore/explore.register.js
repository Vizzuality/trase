import reducerRegistry from 'reducer-registry';
import reducer from './explore.reducer';

reducerRegistry.register('explore', reducer);

// not ideal because you have to change in two, but still better than changing across all app
export {
  EXPLORE__SET_COMMODITY,
  EXPLORE__SET_COUNTRY,
  EXPLORE__SELECT_TOP_CARD,
  EXPLORE__SET_QUICK_FACTS,
  EXPLORE__SET_SANKEY_CARDS,
  EXPLORE__SET_SANKEY_CARDS_LOADING,
  setCommodity,
  setCountry,
  setSankeyCardsLoading,
  goToTool,
  getQuickFacts,
  getSankeyCards
} from './explore.actions';
