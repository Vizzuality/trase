import { createSelector, createStructuredSelector } from 'reselect';

const getAppContexts = state => state.app.contexts;
const getAppSelectedYears = state => state.app.selectedYears;
const getAppSelectedContextId = state => state.app.selectedContextId;
const getAppSelectedCountryId = state => state.nodesPanel.countries.selectedNodeId;
const getAppSelectedCommodityId = state => state.nodesPanel.commodities.selectedNodeId;

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
  [getAppContexts, getAppSelectedContextId, getAppSelectedCountryId, getAppSelectedCommodityId],
  (contexts, selectedContextId, countryId, commodityId) => {
    if (!contexts) {
      return ENABLE_TOOL_PANEL ? null : { id: selectedContextId };
    }

    if (countryId && commodityId) {
      return (
        contexts.find(ctx => (ctx.countryId === countryId && ctx.commodityId) === commodityId) ||
        null
      );
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
