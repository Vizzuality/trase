import {
  EXPLORE__SET_COMMODITY,
  EXPLORE__SET_COUNTRY,
  EXPLORE__SET_QUICK_FACTS,
  EXPLORE__SET_SANKEY_CARDS
} from 'react-components/explore/explore.actions';
import createReducer from 'utils/createReducer';
import immer from 'immer';
import unionBy from 'lodash/unionBy';

export const initialState = {
  selectedCommodityId: null,
  selectedCountryId: null,
  quickFacts: null,
  sankeyCards: null
};

const exploreReducer = {
  [EXPLORE__SET_COMMODITY](state, action) {
    return immer(state, draft => {
      draft.selectedCommodityId = action.payload.selectedCommodityId;
    });
  },
  [EXPLORE__SET_COUNTRY](state, action) {
    return immer(state, draft => {
      draft.selectedCountryId = action.payload.selectedCountryId;
    });
  },
  [EXPLORE__SET_QUICK_FACTS](state, action) {
    return immer(state, draft => {
      draft.quickFacts = action.payload;
    });
  },
  [EXPLORE__SET_SANKEY_CARDS](state, action) {
    return immer(state, draft => {
      const { data, meta } = action.payload;
      const newDataIds = data.reduce((acc, next) => ({ [next.id]: true }), {});
      const intersection = state.sankeyCards?.data.filter(c => newDataIds[c.id]) || [];
      draft.sankeyCards = {
        meta,
        data: unionBy([...intersection, ...data], 'id')
      };
    });
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
