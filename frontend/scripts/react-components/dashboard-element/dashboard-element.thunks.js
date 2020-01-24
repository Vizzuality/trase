import { getMissingItems } from 'react-components/nodes-panel/nodes-panel.register';

export const loadInitialDashboardData = (dispatch, getState, bag) => {
  if (bag?.action?.meta?.location?.kind !== 'redirect') {
    dispatch(getMissingItems());
  }
};
