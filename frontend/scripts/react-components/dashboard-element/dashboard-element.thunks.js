import { getMissingItems } from 'react-components/nodes-panel/nodes-panel.actions';

export const loadInitialDashboardData = (dispatch, getState, bag) => {
  if (bag?.action?.meta?.location?.kind !== 'redirect') {
    dispatch(getMissingItems());
  }
};
