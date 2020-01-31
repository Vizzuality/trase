import { profileRootActions } from 'react-components/profile-root/profile-root.register';

export const loadTopNodes = dispatch => dispatch(profileRootActions.getTopProfiles());
