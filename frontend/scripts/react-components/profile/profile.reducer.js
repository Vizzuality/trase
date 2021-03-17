import createReducer from 'utils/createReducer';
import { SET_PROFILE_PLACE_BOUNDS } from './profile.actions';
import initialState from './profile.initial-state';

const profileReducer = {
  [SET_PROFILE_PLACE_BOUNDS](state, action) {
    return { ...state, placeBounds: action.payload };
  }
};

const profileReducerTypes = PropTypes => ({
  placeBounds: PropTypes.array
});

export default createReducer(initialState, profileReducer, profileReducerTypes);
