import { createSelector } from 'reselect';

const getCurrentPage = state => state.location.type;
const getSelectedContext = state => state.app.selectedContext;
const getContextIsUserSelected = state => state.app.contextIsUserSelected;

export const getNavFilters = createSelector(
  [getCurrentPage, getSelectedContext, getContextIsUserSelected],
  (page, selectedContext, contextIsUserSelected) => {
    const isToolPage = page === 'tool';
    const navDisplaysContext = selectedContext && (contextIsUserSelected || isToolPage);
    return {
      toolLinks: isToolPage,
      toolSearch: isToolPage,
      year: navDisplaysContext,
      contextSelector: navDisplaysContext,
      yearsDropdown: page === 'logisticsMap',
      resizeBy: selectedContext && isToolPage,
      recolorBy: selectedContext && isToolPage,
      adminLevel: selectedContext && isToolPage,
      viewSelector: selectedContext && isToolPage
    };
  }
);
