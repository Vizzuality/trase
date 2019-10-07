import {
  getDashboardMissingPanelItems,
  getDashboardMissingNodes
} from './dashboard-element.actions';

export const loadInitialDashboardData = (dispatch, getState, bag) => {
  const meta = bag?.action?.meta;
  if (meta?.location?.kind !== 'redirect') {
    dispatch(getDashboardMissingPanelItems());
  }
  const query = bag?.action?.payload?.query;
  if (query) {
    const selectedNodes = [
      ...(query.sources || []),
      ...(query.destinations || []),
      ...(query.companies || [])
    ];
    if (selectedNodes.length) {
      dispatch(getDashboardMissingNodes(selectedNodes));
    }
  }
};
