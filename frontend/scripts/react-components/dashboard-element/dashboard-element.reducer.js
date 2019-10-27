import immer from 'immer';
import createReducer from 'utils/createReducer';
import { deserialize } from 'react-components/shared/url-serializer/url-serializer.component';
import dashboardElementSerialization from 'react-components/dashboard-element/dashboard-element.serializers';
import {
  DASHBOARD_ELEMENT__SET_ACTIVE_PANEL,
  DASHBOARD_ELEMENT__SET_SELECTED_YEARS,
  DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY,
  DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY,
  DASHBOARD_ELEMENT__SET_CHARTS,
  DASHBOARD_ELEMENT__EDIT_DASHBOARD,
  DASHBOARD_ELEMENT__SET_MISSING_DATA,
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
  [DASHBOARD_ELEMENT__SET_ACTIVE_PANEL](state, action) {
    return immer(state, draft => {
      const { activePanelId } = action.payload;
      draft.activePanelId = activePanelId;
    });
  },
  [DASHBOARD_ELEMENT__EDIT_DASHBOARD](state) {
    return { ...state, editMode: true };
  },
  [DASHBOARD_ELEMENT__SET_MISSING_DATA](state, action) {
    return immer(state, draft => {
      const { data } = action.payload;
      const panelsByItem = {};
      state.sources.forEach(id => {
        panelsByItem[id] = 'sources';
      });
      state.exporters.forEach(id => {
        panelsByItem[id] = 'exporters';
      });
      state.importers.forEach(id => {
        panelsByItem[id] = 'importers';
      });
      state.destinations.forEach(id => {
        panelsByItem[id] = 'destinations';
      });
      data.forEach(item => {
        const panel = panelsByItem[item.id];
        draft.data[panel].push(item);
      });
    });
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
  activePanelId: PropTypes.string.isRequired,
  selectedYears: PropTypes.arrayOf(PropTypes.number),
  selectedResizeBy: PropTypes.number,
  selectedRecolorBy: PropTypes.number,
  selectedCountryId: PropTypes.number,
  selectedCommodityId: PropTypes.number
});

export { initialState };
export default createReducer(initialState, dashboardElementReducer, dashboardElementReducerTypes);
