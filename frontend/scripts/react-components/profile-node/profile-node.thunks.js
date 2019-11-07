import { getColumns } from 'react-components/profile-node/profile-node.actions';

export const loadColumnsData = (dispatch, getState, bag) => {
  if (bag?.action?.meta?.location?.kind !== 'redirect') {
    dispatch(getColumns());
  }
};
