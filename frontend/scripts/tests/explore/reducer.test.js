import reducer, { initialState } from 'react-components/explore/explore.reducer';
import {
  EXPLORE__SET_COMMODITY,
  EXPLORE__SET_COUNTRY,
  EXPLORE__SET_QUICK_FACTS,
  EXPLORE__SET_SANKEY_CARDS,
  EXPLORE__SET_SANKEY_CARDS_LOADING,
  setCommodity,
  setCountry,
  setSankeyCardsLoading
} from 'react-components/explore/explore.actions';

test(EXPLORE__SET_COMMODITY, () => {
  const action = setCommodity(12);
  const newState = reducer(initialState, action);
  expect(newState).toEqual({ ...initialState, selectedCommodityId: 12 });
});

test(EXPLORE__SET_COUNTRY, () => {
  const action = setCountry(12);
  const newState = reducer(initialState, action);
  expect(newState).toEqual({ ...initialState, selectedCountryId: 12 });
});

test(EXPLORE__SET_QUICK_FACTS, () => {
  const quickFacts = {
    data: [{ id: 0 }],
    meta: { attributes: [{ id: 0 }] }
  };
  const action = {
    type: EXPLORE__SET_QUICK_FACTS,
    payload: quickFacts
  };
  const newState = reducer(initialState, action);
  expect(newState).toEqual({ ...initialState, quickFacts });
});

test(EXPLORE__SET_SANKEY_CARDS, () => {
  const sankeyCards1 = {
    data: [{ id: 0 }, { id: 1 }],
    meta: { nodes: [], columns: {} }
  };
  const action = {
    type: EXPLORE__SET_SANKEY_CARDS,
    payload: sankeyCards1
  };
  const newState = reducer(initialState, action);
  expect(newState).toEqual({ ...initialState, sankeyCards: sankeyCards1 });

  const sankeyCards2 = {
    data: [{ id: 2 }, { id: 0 }, { id: 3 }],
    meta: { nodes: [], columns: {} }
  };
  const secondAction = {
    type: EXPLORE__SET_SANKEY_CARDS,
    payload: sankeyCards2
  };

  const newState2 = reducer(newState, secondAction);
  expect(newState2).toEqual({
    ...newState,
    sankeyCards: {
      data: [{ id: 0 }, { id: 2 }, { id: 3 }],
      meta: { nodes: [], columns: {} }
    }
  });
});

test(EXPLORE__SET_SANKEY_CARDS_LOADING, () => {
  const action = setSankeyCardsLoading(true);
  const newState = reducer(initialState, action);
  expect(newState).toEqual({ ...initialState, sankeyCardsLoading: true });
});
