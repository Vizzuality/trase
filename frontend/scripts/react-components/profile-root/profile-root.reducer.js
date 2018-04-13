import clone from 'lodash/clone';
import { createReducer } from 'store';
import {
  LOAD_PROFILE_SEARCH_RESULTS,
  SET_PROFILE_SEARCH_ERROR_MESSAGE,
  SET_PROFILE_SEARCH_TERM
} from 'react-components/profile-root/profile-root.actions';

const initialState = {
  search: {
    term: '',
    isLoading: false,
    results: []
  },
  errorMessage: null
};

const profileRootReducer = {
  [SET_PROFILE_SEARCH_TERM](state, action) {
    return { ...state, search: { ...state.search, ...action.payload } };
  },
  [LOAD_PROFILE_SEARCH_RESULTS](state, action) {
    return { ...state, search: { ...state.search, results: action.payload, isLoading: false } };
  },
  [SET_PROFILE_SEARCH_ERROR_MESSAGE](state, action) {
    const { errorMessage } = action.payload;
    return { ...state, errorMessage: clone(errorMessage) };
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
