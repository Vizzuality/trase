import reducer, { initialState } from 'react-components/tool-selector/tool-selector.reducer';
import {
  TOOL_SELECTOR__SET_COMMODITY,
  TOOL_SELECTOR__SET_COUNTRY,
  setCommodity,
  setCountry
} from 'react-components/tool-selector/tool-selector.actions';

test(TOOL_SELECTOR__SET_COMMODITY, () => {
  const action = setCommodity(12);
  const newState = reducer(initialState, action);
  expect(newState).toEqual({ ...initialState, activeCommodityId: 12 });
});

test(TOOL_SELECTOR__SET_COUNTRY, () => {
  const action = setCountry(12);
  const newState = reducer(initialState, action);
  expect(newState).toEqual({ ...initialState, activeCountryId: 12 });
});
