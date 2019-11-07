import createReducer from 'utils/createReducer';
import { deserialize } from 'react-components/shared/url-serializer/url-serializer.component';
import dashboardElementSerialization from 'react-components/dashboard-element/dashboard-element.serializers';
import {
  DASHBOARD_ELEMENT__SET_SELECTED_YEARS,
  DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY,
  DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY,
  DASHBOARD_ELEMENT__SET_CHARTS,
  DASHBOARD_ELEMENT__EDIT_DASHBOARD,
  DASHBOARD_ELEMENT__SET_LOADING
} from './dashboard-element.actions';
import initialState from './dashboard-element.initial-state';

const dashboardElementReducer = {
  dashboardElement(state, action) {
    if (action.payload?.serializerParams) {
      const newState = deserialize({
        params: action.payload.serializerParams,
        state: initialState,
        ...dashboardElementSerialization
      });
      return newState;
    }
    return state;
  },
  [DASHBOARD_ELEMENT__EDIT_DASHBOARD](state) {
    return { ...state, editMode: true };
  },
  [DASHBOARD_ELEMENT__SET_SELECTED_YEARS](state, action) {
    const { years } = action.payload;
    return {
      ...state,
      selectedYears: years
    };
  },
  [DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY](state, action) {
    const { indicator } = action.payload;
    return {
      ...state,
      selectedResizeBy: indicator.attributeId
    };
  },
  [DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY](state, action) {
    const { indicator } = action.payload;
    return {
      ...state,
      selectedRecolorBy: indicator.attributeId
    };
  },
  [DASHBOARD_ELEMENT__SET_CHARTS](state, action) {
    const { charts } = action.payload;
    return {
      ...state,
      charts
    };
  },
  [DASHBOARD_ELEMENT__SET_LOADING](state, action) {
    const { loading } = action.payload;
    return { ...state, loading };
  }
};

const dashboardElementReducerTypes = PropTypes => ({
  loading: PropTypes.bool.isRequired,
  selectedResizeBy: PropTypes.number,
  selectedRecolorBy: PropTypes.number,
  selectedYears: PropTypes.arrayOf(PropTypes.number)
});

export { initialState };
export default createReducer(initialState, dashboardElementReducer, dashboardElementReducerTypes);
