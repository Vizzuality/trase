import {
  EXPLORE__SET_COMMODITY,
  EXPLORE__SET_COUNTRY,
  EXPLORE__SET_EDIT_MODE
} from 'react-components/explore/explore.actions';
import createReducer from 'utils/createReducer';

export const initialState = {
  editing: true,
  selectedCommodityId: null,
  selectedCountryId: null
};

const exploreReducer = {
  [EXPLORE__SET_EDIT_MODE](state, action) {
    const { editing } = action.payload;
    return { ...state, editing };
  },
  [EXPLORE__SET_COMMODITY](state, action) {
    const { selectedCommodityId } = action.payload;
    return { ...state, selectedCommodityId };
  },
  [EXPLORE__SET_COUNTRY](state, action) {
    const { selectedCountryId } = action.payload;
    return { ...state, selectedCountryId };
  }
};

const exploreReducerTypes = PropTypes => ({
  selectedCommodityId: PropTypes.number,
  selectedCountryId: PropTypes.number
});

export default createReducer(initialState, exploreReducer, exploreReducerTypes);
