import createReducer from 'utils/createReducer';
import { DASHBOARD_WIDGET__SET_ACTIVE_MODAL } from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.actions';

const initialState = {
  activeModal: null
};

const dashboardWidgetReducer = {
  [DASHBOARD_WIDGET__SET_ACTIVE_MODAL](state, action) {
    return { ...state, activeModal: action.payload };
  }
};

export default createReducer(initialState, dashboardWidgetReducer);
