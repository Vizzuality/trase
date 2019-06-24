import createReducer from 'utils/createReducer';
import {
  PROFILES__SET_ACTIVE_STEP,
  PROFILES__SET_ACTIVE_PROFILE_TYPE
} from 'react-components/shared/profile-selector/profile-selector.actions';

const initialState = {
  activeStep: null,
  activeProfileType: null
};

const profileRootReducer = {
  [PROFILES__SET_ACTIVE_STEP](state, action) {
    const { activeStep } = action.payload;
    return {
      ...state,
      activeStep
    };
  },
  [PROFILES__SET_ACTIVE_PROFILE_TYPE](state, action) {
    const { activeProfileType } = action.payload;
    return {
      ...state,
      activeProfileType
    };
  }
};

const profileSelectorReducerTypes = PropTypes => ({
  activePanelId: PropTypes.string
});

export default createReducer(initialState, profileRootReducer, profileSelectorReducerTypes);
