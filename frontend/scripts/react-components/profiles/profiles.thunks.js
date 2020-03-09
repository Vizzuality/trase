import { profilesActions } from 'react-components/profiles/profiles.register';

export const loadTopNodes = dispatch => dispatch(profilesActions.getTopProfiles());
