import createReducer from 'utils/createReducer';
import { PROFILES__SET_ACTIVE_STEP } from 'react-components/shared/profile-selector/profile-selector.actions';

const initialState = {
  activeStep: null
};

const profileRootReducer = {
  [PROFILES__SET_ACTIVE_STEP](state, action) {
    const { activeStep } = action.payload;
    return {
      ...state,
      activeStep
    };
  }
};

const profileSelectorReducerTypes = PropTypes => ({
  activePanelId: PropTypes.string
});

export default createReducer(initialState, profileRootReducer, profileSelectorReducerTypes);
