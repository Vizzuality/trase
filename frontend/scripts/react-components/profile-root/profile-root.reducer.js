import createReducer from 'utils/createReducer';
import fuzzySearch from 'utils/fuzzySearch';
import {
  LOAD_PROFILE_SEARCH_RESULTS,
  SET_PROFILE_ROOT_ERROR_MESSAGE,
  SET_PROFILE_SEARCH_TERM,
  SET_TOP_PROFILES
} from './profile-root.actions';
import initialState from './profile-root.initial-state';

const profileRootReducer = {
  [SET_TOP_PROFILES](state, action) {
    return { ...state, topProfiles: action.payload };
  },
  [SET_PROFILE_SEARCH_TERM](state, action) {
    return { ...state, search: { ...state.search, ...action.payload } };
  },
  [LOAD_PROFILE_SEARCH_RESULTS](state, action) {
    return {
      ...state,
      search: {
        ...state.search,
        results: fuzzySearch(state.search.term, action.payload),
        isLoading: false
      }
    };
  },
  [SET_PROFILE_ROOT_ERROR_MESSAGE](state, action) {
    return { ...state, errorMessage: action.payload.errorMessage };
  }
};

const profileRootReducerTypes = PropTypes => ({
  search: PropTypes.shape({
    term: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    results: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  errorMessage: PropTypes.string
});

export default createReducer(initialState, profileRootReducer, profileRootReducerTypes);
