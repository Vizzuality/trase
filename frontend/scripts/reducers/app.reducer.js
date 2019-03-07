import {
  DISPLAY_STORY_MODAL,
  LOAD_SEARCH_RESULTS,
  LOAD_TOOLTIP,
  SET_SANKEY_SIZE,
  SET_SEARCH_TERM,
  SET_TOOLTIPS,
  SHOW_DISCLAIMER,
  TOGGLE_DROPDOWN,
  TOGGLE_MAP_LAYERS_MENU,
  SET_CONTEXTS,
  SET_CONTEXT_IS_USER_SELECTED,
  SET_CONTEXT,
  LOAD_INITIAL_CONTEXT,
  LOAD_STATE_FROM_URL,
  APP__SET_LOADING
} from 'actions/app.actions';
import createReducer from 'utils/createReducer';
import { SELECT_YEARS } from 'actions/tool.actions';

const initialState = {
  windowSize: [window.innerWidth, window.innerHeight],
  isMapLayerVisible: false,
  isAppMenuVisible: false,
  tooltipCheck: 0,
  tooltips: null,
  contextIsUserSelected: !SHOW_WORLD_MAP_IN_EXPLORE,
  currentDropdown: null,
  modal: {
    visibility: false,
    modalParams: null
  },
  search: {
    term: '',
    isLoading: false,
    results: []
  },
  selectedContext: null,
  initialSelectedContextIdFromURL: null, // IMPORTANT: this should only be used to load context by id from the URL
  contexts: [],
  loading: {
    contexts: false,
    tooltips: false
  },
  selectedYears: []
};

const isSankeyExpanded = state => state.isMapLayerVisible !== true && state.isMapVisible !== true;

const appReducer = {
  [LOAD_STATE_FROM_URL](state, action) {
    return { ...state, initialDataLoading: true, ...action.payload.app };
  },
  [SET_SANKEY_SIZE](state) {
    if (isSankeyExpanded(state)) {
      return Object.assign({}, state, {
        sankeySize: [window.innerWidth - 392, window.innerHeight - 175]
      });
    }
    return state;
  },
  [TOGGLE_MAP_LAYERS_MENU](state) {
    return Object.assign({}, state, { isMapLayerVisible: !state.isMapLayerVisible });
  },
  [LOAD_TOOLTIP](state) {
    return Object.assign({}, state, { tooltipCheck: (state.tooltipCheck || 0) + 1 });
  },
  [SET_TOOLTIPS](state, action) {
    return { ...state, tooltips: action.payload, loading: { ...state.loading, tooltips: false } };
  },
  [SHOW_DISCLAIMER](state, action) {
    return Object.assign({}, state, {
      modal: {
        visibility: true,
        modalParams: {
          description: action.disclaimerContent
        }
      }
    });
  },
  [TOGGLE_DROPDOWN](state, action) {
    const currentDropdown = action.dropdownId === state.currentDropdown ? null : action.dropdownId;
    return Object.assign({}, state, { currentDropdown });
  },
  [DISPLAY_STORY_MODAL](state, action) {
    return { ...state, modal: action.payload };
  },
  [SET_SEARCH_TERM](state, action) {
    return { ...state, search: { ...state.search, ...action.payload } };
  },
  [LOAD_SEARCH_RESULTS](state, action) {
    // if current search term is different than the one for results
    // that means we can ignore those results as not the latest ones
    if (state.search.term !== action.payload.term) return state;

    return {
      ...state,
      search: { ...state.search, results: action.payload.results, isLoading: false }
    };
  },
  [SET_CONTEXTS](state, action) {
    return { ...state, contexts: action.payload, loading: { ...state.loading, contexts: false } };
  },
  [SET_CONTEXT_IS_USER_SELECTED](state, action) {
    return Object.assign({}, state, { contextIsUserSelected: action.payload });
  },
  [SET_CONTEXT](state, action) {
    const selectedContext = action.payload;
    const selectedYears = [selectedContext.defaultYear, selectedContext.defaultYear];

    return { ...state, selectedYears, selectedContext };
  },
  [LOAD_INITIAL_CONTEXT](state, action) {
    const selectedContext = action.payload;

    const selectedYears =
      state.selectedYears.length > 0
        ? state.selectedYears
        : [selectedContext.defaultYear, selectedContext.defaultYear];

    return { ...state, selectedYears, selectedContext };
  },
  [APP__SET_LOADING](state, action) {
    const { contexts: contextsLoading, tooltips: tooltipsLoading } = state.loading;
    const { contexts = contextsLoading, tooltips = tooltipsLoading } = action.payload;
    return { ...state, loading: { contexts, tooltips } };
  },
  [SELECT_YEARS](state, action) {
    return { ...state, selectedYears: action.years };
  }
};

const appReducerTypes = PropTypes => ({
  contexts: PropTypes.arrayOf(PropTypes.object).isRequired,
  contextIsUserSelected: PropTypes.bool.isRequired,
  currentDropdown: PropTypes.string,
  isMapLayerVisible: PropTypes.bool,
  isAppMenuVisible: PropTypes.bool,
  modal: PropTypes.shape({
    visibility: PropTypes.bool,
    modalParams: PropTypes.object
  }).isRequired,
  search: PropTypes.shape({
    term: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    results: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  selectedContext: PropTypes.object,
  initialSelectedContextIdFromURL: PropTypes.number,
  tooltips: PropTypes.object,
  tooltipCheck: PropTypes.number,
  windowSize: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedYears: PropTypes.arrayOf(PropTypes.number).isRequired
});

export default createReducer(initialState, appReducer, appReducerTypes);
