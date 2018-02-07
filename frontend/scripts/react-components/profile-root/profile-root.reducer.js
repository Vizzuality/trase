import clone from 'lodash/clone';
import { createReducer } from 'store';
import {
  SET_PROFILE_SEARCH_ERROR_MESSAGE,
  SET_PROFILE_SEARCH_NODES
} from 'react-components/profile-root/profile-root.actions';

const initialState = {
  nodes: [],
  errorMessage: null
};

const profileRootReducer = {
  [SET_PROFILE_SEARCH_NODES](state, action) {
    const { nodes } = action.payload;
    return { ...state, nodes: clone(nodes) };
  },
  [SET_PROFILE_SEARCH_ERROR_MESSAGE](state, action) {
    const { errorMessage } = action.payload;
    return { ...state, errorMessage: clone(errorMessage) };
  }
};

const profileRootReducerTypes = PropTypes => ({
  nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  errorMessage: PropTypes.string
});

export default createReducer(initialState, profileRootReducer, profileRootReducerTypes);
