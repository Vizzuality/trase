import createReducer from 'utils/createReducer';
import {
  DASHBOARD_ROOT__SET_DASHBOARD_TEMPLATES,
  DASHBOARD_ROOT__SET_LOADING_DASHBOARD_TEMPLATES
} from './dashboard-root.actions';
import initialState from './dashboard-root.initial-state';

const dashboardRootReducer = {
  [DASHBOARD_ROOT__SET_DASHBOARD_TEMPLATES](state, action) {
    const dashboardTemplates = action.payload;
    return { ...state, dashboardTemplates };
  },
  [DASHBOARD_ROOT__SET_LOADING_DASHBOARD_TEMPLATES](state, action) {
    const loadingDashboardTemplates = action.payload;
    return { ...state, loadingDashboardTemplates };
  }
};

const dashboardRootReducerTypes = PropTypes => ({
  dashboardTemplates: PropTypes.arrayOf(PropTypes.object).isRequired,
  loadingDashboardTemplates: PropTypes.any
});

export default createReducer(initialState, dashboardRootReducer, dashboardRootReducerTypes);
