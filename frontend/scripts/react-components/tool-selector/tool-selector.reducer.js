import {
  TOOL_SELECTOR__SET_EDIT_MODE,
  TOOL_SELECTOR__SET_COMMODITY,
  TOOL_SELECTOR__SET_COUNTRY
} from 'react-components/tool-selector/tool-selector.actions';
import createReducer from 'utils/createReducer';

export const initialState = {
  editing: true,
  activeCommodityId: null,
  activeCountryId: null
};

const toolSelectorReducer = {
  [TOOL_SELECTOR__SET_EDIT_MODE](state, action) {
    const { editing } = action.payload;
    return { ...state, editing };
  },
  [TOOL_SELECTOR__SET_COMMODITY](state, action) {
    const { activeCommodityId } = action.payload;
    return { ...state, activeCommodityId };
  },
  [TOOL_SELECTOR__SET_COUNTRY](state, action) {
    const { activeCountryId } = action.payload;
    return { ...state, activeCountryId };
  }
};

const toolSelectorReducerTypes = PropTypes => ({
  activeCommodityId: PropTypes.number,
  activeCountryId: PropTypes.number
});

export default createReducer(initialState, toolSelectorReducer, toolSelectorReducerTypes);
