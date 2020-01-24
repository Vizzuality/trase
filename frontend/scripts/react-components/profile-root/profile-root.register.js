import reducerRegistry from 'reducer-registry';
import reducer from './profile-root.reducer';

reducerRegistry.register('profileRoot', reducer);

// not ideal because you have to change in two, but still better than changing across all app
export {
  SET_PROFILE_SEARCH_TERM,
  LOAD_PROFILE_SEARCH_RESULTS,
  SET_PROFILE_ROOT_ERROR_MESSAGE,
  GET_TOP_PROFILES,
  SET_TOP_PROFILES,
  goToNodeProfilePage,
  resetProfileSearchResults,
  searchNodeWithTerm,
  getTopProfiles
} from './profile-root.actions';
