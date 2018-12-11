import { createSelector } from 'reselect';

const getContexts = state => state.app.contexts;

export const getCountryNamesByCountryId = createSelector(
  [getContexts],
  contexts =>
    contexts.reduce(
      (acc, next) => ({
        ...acc,
        [next.countryId]: next.countryName
      }),
      {}
    )
);
