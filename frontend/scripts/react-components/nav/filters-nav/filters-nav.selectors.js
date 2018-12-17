import { createSelector } from 'reselect';
import { LOGISTICS_MAP_CONTEXTS } from 'constants';

const getCurrentPage = state => state.location.type;
const getSelectedContext = state => state.app.selectedContext;
const getContextIsUserSelected = state => state.app.contextIsUserSelected;

// TODO: refactor filters nav to receive all filters props from the filters-nav.container.js
// The implementation of the component should paint dumb components,
// as of now each filter is connected which makes them hard to reutilize
export const getNavFilters = createSelector(
  [getCurrentPage, getSelectedContext, getContextIsUserSelected],
  (page, selectedContext, contextIsUserSelected) => {
    const isToolPage = page === 'tool';
    const isLogisticsMapPage = page === 'logisticsMap';
    const navDisplaysContext = selectedContext && (contextIsUserSelected || isToolPage);
    return {
      toolLinks: isToolPage,
      toolSearch: isToolPage,
      year: navDisplaysContext && !isLogisticsMapPage,
      contextSelector: navDisplaysContext,
      yearsDropdown: page === 'logisticsMap', // TODO: tech-debt the idea is to remove this too!
      resizeBy: selectedContext && isToolPage,
      recolorBy: selectedContext && isToolPage,
      adminLevel: selectedContext && isToolPage,
      viewSelector: selectedContext && isToolPage
    };
  }
);

export const getContextsForLogisticsMap = createSelector(
  [getCurrentPage],
  page => {
    if (page === 'logisticsMap') {
      return contexts =>
        contexts.filter(ctx =>
          LOGISTICS_MAP_CONTEXTS.includes(`${ctx.countryName}_${ctx.commodityName}`)
        );
    }
    return undefined;
  }
);
