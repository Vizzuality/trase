import { getDashboardMissingPanelItems } from './dashboard-element.actions';

export const loadInitialDashboardData = (dispatch, getState, bag) => {
  if (bag?.action?.meta?.location?.kind !== 'redirect') {
    dispatch(getDashboardMissingPanelItems());
  }
};
