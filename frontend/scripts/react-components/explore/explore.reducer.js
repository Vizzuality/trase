import {
  EXPLORE__SET_COMMODITY,
  EXPLORE__SET_COUNTRY,
  EXPLORE__SET_EDIT_MODE
} from 'react-components/explore/explore.actions';
import createReducer from 'utils/createReducer';

export const initialState = {
  editing: true,
  activeCommodityId: null,
  activeCountryId: null
};

const exploreReducer = {
  [EXPLORE__SET_EDIT_MODE](state, action) {
    const { editing } = action.payload;
    return { ...state, editing };
  },
  [EXPLORE__SET_COMMODITY](state, action) {
    const { activeCommodityId } = action.payload;
    return { ...state, activeCommodityId };
  },
  [EXPLORE__SET_COUNTRY](state, action) {
    const { activeCountryId } = action.payload;
    return { ...state, activeCountryId };
  }
};

const exploreReducerTypes = PropTypes => ({
  activeCommodityId: PropTypes.number,
  activeCountryId: PropTypes.number
});

export default createReducer(initialState, exploreReducer, exploreReducerTypes);
