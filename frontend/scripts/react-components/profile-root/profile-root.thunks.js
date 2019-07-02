import { getTopProfiles } from 'react-components/profile-root/profile-root.actions';

export const loadTopNodes = dispatch => {
  dispatch(getTopProfiles());
};
