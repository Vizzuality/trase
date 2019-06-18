import { createSelector, createStructuredSelector } from 'reselect';

const getContexts = state => state.app.contexts;
const getSelectedYears = state => state.app.selectedYears;
const getSelectedContext = state => state.app.selectedContext;

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

export const getAppUrlProps = createStructuredSelector({
  selectedYears: getSelectedYears,
  selectedContext: getSelectedContext
});
