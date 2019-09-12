import { createSelector, createStructuredSelector } from 'reselect';

const getAppContexts = state => state.app.contexts;
const getAppSelectedYears = state => state.app.selectedYears;
const getAppSelectedContextId = state => state.app.selectedContextId;

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
  [getAppContexts, getAppSelectedContextId],
  (contexts, selectedContextId) => {
    if (!contexts) {
      return { id: selectedContextId };
    }

    if (selectedContextId === null) {
      return contexts.find(ctx => ctx.isDefault) || null;
    }
    return contexts.find(ctx => ctx.id === selectedContextId) || null;
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
  selectedContextId: getAppSelectedContextId
});
