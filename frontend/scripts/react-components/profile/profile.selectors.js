import { createSelector } from 'reselect';

const getLocation = state => state.location;
const getApp = state => state.app;
const getProfileSelector = state => state.profileSelector;

export const getUnitLayers = state => state.toolLayers.data.mapUnitLayers || null;

// TODO: Refactor
export const getProfileProps = createSelector(
  [getApp, getLocation, getProfileSelector, getUnitLayers],
  (app, location, profileSelector, unitLayers) => {
    const {
      query: { year: selectedYear, nodeId, print, contextId, commodityId } = {},
      payload: { profileType }
    } = location;
    const { contexts } = app;
    const { type: panelType } = profileSelector.panels;
    const props = {
      selectedYear,
      profileType,
      printMode: print && JSON.parse(print),
      nodeId: parseInt(nodeId, 10)
    };

    if (panelType === 'destinations') {
      return { ...props, isImporterCountry: true, commodityId };
    }

    // TODO: Refactor this part

    const ctxId = contextId && parseInt(contextId, 10);
    let context;

    if (ctxId && !commodityId) {
      context = contexts.find(ctx => ctx.id === ctxId) || { id: ctxId };

      props.context = context;
    } else if (ctxId && commodityId) {
      context = contexts.find(ctx => ctx.id === ctxId && ctx.commodityId === commodityId);

      // If we don't have a context (commodity changed)
      // Find old context then get context with old countryId and new commodityId
      if (!context) {
        const oldContext = contexts.find(ctx => ctx.id === ctxId);
        context = contexts.find(
          ctx => ctx.countryId === oldContext.countryId && ctx.commodityId === commodityId
        );
      }

      props.context = context;
    }

    if (commodityId) {
      props.commodityId = commodityId;
    }

    if (unitLayers && props.context && profileType === 'place') {
      props.unitLayers = unitLayers.filter(u =>
        u.id.startsWith(props.context.countryName?.toLowerCase())
      );
    }

    return props;
  }
);
