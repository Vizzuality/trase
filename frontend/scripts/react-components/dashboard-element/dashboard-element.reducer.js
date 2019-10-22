import createReducer from 'utils/createReducer';
import {
  DASHBOARD_ELEMENT__SET_CHARTS,
  DASHBOARD_ELEMENT__SET_LOADING
} from './dashboard-element.actions';
import initialState from './dashboard-element.initial-state';

const dashboardElementReducer = {
  dashboardElement(state) {
    return state;
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
  charts: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  loadingItems: PropTypes.bool.isRequired
});

export { initialState };
export default createReducer(initialState, dashboardElementReducer, dashboardElementReducerTypes);
