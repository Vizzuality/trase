import { createSelector, createStructuredSelector } from 'reselect';

const getAppContexts = state => state.app.contexts;
const getAppSelectedYears = state => state.app.selectedYears;
const getAppSelectedContext = state => state.app.selectedContext;

export const getCountryNamesByCountryId = createSelector(
  [getAppContexts],
  contexts =>
    contexts.reduce(
      (acc, next) => ({
        ...acc,
        [next.countryId]: next.countryName
      }),
      {}
    )
);

export const getSelectedContext = createSelector(
  [getAppContexts, getAppSelectedContext],
  (contexts, selectedContext) => {
    if (!contexts) {
      return selectedContext;
    }

    if (selectedContext === null) {
      return contexts.find(ctx => ctx.isDefault);
    }

    return contexts.find(ctx => ctx.id === selectedContext.id);
  }
);

export const getSelectedYears = createSelector(
  [getSelectedContext, getAppSelectedYears],
  (selectedContext, selectedYears) => {
    if (!selectedContext && !selectedYears) {
      return [];
    }

    if (selectedYears) {
      return selectedYears;
    }

    return [selectedContext.defaultYear, selectedContext.defaultYear];
  }
);

export const getAppUrlProps = createStructuredSelector({
  selectedYears: getAppSelectedYears,
  selectedContext: getAppSelectedContext
});
