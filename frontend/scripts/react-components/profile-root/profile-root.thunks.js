import { getTopProfiles } from 'react-components/profile-root/profile-root.actions';

export const loadTopNodes = (dispatch, getState) => {
  const state = getState();
  if (state?.app?.profileRoot?.topProfiles) {
    return;
  }
  dispatch(getTopProfiles());
};
