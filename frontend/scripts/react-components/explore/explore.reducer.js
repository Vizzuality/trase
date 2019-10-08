import {
  EXPLORE__SET_COMMODITY,
  EXPLORE__SET_COUNTRY,
  EXPLORE__SET_QUICK_FACTS,
  EXPLORE__SET_SANKEY_CARDS
} from 'react-components/explore/explore.actions';
import createReducer from 'utils/createReducer';

export const initialState = {
  selectedCommodityId: null,
  selectedCountryId: null,
  quickFacts: null,
  sankeyCards: null
};

const exploreReducer = {
  [EXPLORE__SET_COMMODITY](state, action) {
    const { selectedCommodityId } = action.payload;
    return { ...state, selectedCommodityId };
  },
  [EXPLORE__SET_COUNTRY](state, action) {
    const { selectedCountryId } = action.payload;
    return { ...state, selectedCountryId };
  },
  [EXPLORE__SET_QUICK_FACTS](state, action) {
    const { data, meta } = action.payload;
    return { ...state, quickFacts: { data, meta } };
  },
  [EXPLORE__SET_SANKEY_CARDS](state, action) {
    return { ...state, sankeyCards: action.payload };
  }
};

const exploreReducerTypes = PropTypes => ({
  selectedCommodityId: PropTypes.number,
  selectedCountryId: PropTypes.number,
  quickFacts: PropTypes.shape({
    data: PropTypes.array,
    meta: PropTypes.object
  }),
  sankeyCards: PropTypes.shape({
    data: PropTypes.array,
    meta: PropTypes.object
  })
});

export default createReducer(initialState, exploreReducer, exploreReducerTypes);
