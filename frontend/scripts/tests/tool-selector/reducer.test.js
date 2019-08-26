import reducer, { initialState } from 'react-components/explore/explore.reducer';
import {
  EXPLORE__SET_COMMODITY,
  EXPLORE__SET_COUNTRY,
  setCommodity,
  setCountry
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
