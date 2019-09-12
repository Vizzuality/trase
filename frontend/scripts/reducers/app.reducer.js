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
  APP__SET_LOADING,
  APP__TRANSIFEX_LANGUAGES_LOADED,
  APP__SET_TOP_DESTINATION_COUNTRIES,
  APP__SET_TOP_DESTINATION_COUNTRIES_LOADING
} from 'actions/app.actions';
import { COUNTRIES_COORDINATES } from 'scripts/countries';
import createReducer from 'utils/createReducer';
import { SELECT_YEARS } from 'react-components/tool/tool.actions';
import { TOOL_LINKS_RESET_SANKEY } from 'react-components/tool-links/tool-links.actions';
import { deserialize } from 'react-components/shared/url-serializer/url-serializer.component';
import initialState from './app.initial-state';

const isSankeyExpanded = state => state.isMapLayerVisible !== true && state.isMapVisible !== true;

const appReducer = {
  tool(state, action) {
    if (action.payload?.serializerParams) {
      const shouldResetYears =
        action.payload.serializerParams.selectedContextId &&
        action.payload.serializerParams.selectedContextId !== state.selectedContextId;

      const baseState = shouldResetYears ? { ...state, selectedYears: null } : state;
      const newState = deserialize({
        params: action.payload.serializerParams,
        state: baseState,
        props: ['selectedContextId', 'selectedYears']
      });
      return newState;
    }
    return state;
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
    return { ...state, selectedYears: null, selectedContextId: action.payload };
  },
  [APP__SET_LOADING](state, action) {
    const { contexts: contextsLoading, tooltips: tooltipsLoading } = state.loading;
    const { contexts = contextsLoading, tooltips = tooltipsLoading } = action.payload;
    return { ...state, loading: { contexts, tooltips } };
  },
  [SELECT_YEARS](state, action) {
    return { ...state, selectedYears: action.payload.years };
  },
  [APP__TRANSIFEX_LANGUAGES_LOADED](state, action) {
    const { languages } = action.payload;
    return { ...state, languages };
  },
  [TOOL_LINKS_RESET_SANKEY](state) {
    return { ...state, selectedYears: initialState.selectedYears };
  },
  [APP__SET_TOP_DESTINATION_COUNTRIES](state, action) {
    const { topCountries } = action.payload;
    const getNodes = (data, country) =>
      data.targetNodes.map(row => ({
        ...row,
        coordinates: COUNTRIES_COORDINATES[row.geo_id],
        geoId: row.geo_id,
        name: country === row.name ? 'DOMESTIC CONSUMPTION' : row.name
      }));

    const newTopCountries = {};
    topCountries.forEach(c => {
      newTopCountries[c.topNodesKey] = getNodes(c.data, c.country);
    });

    const topCountriesLoadingKeys = {};
    topCountries.forEach(c => {
      topCountriesLoadingKeys[c.topNodesKey] = false;
    });
    return {
      ...state,
      topNodes: {
        ...state.topNodes,
        ...newTopCountries
      },
      loading: {
        ...state.loading,
        topCountries: {
          ...state.loading.topCountries,
          ...topCountriesLoadingKeys
        }
      }
    };
  },
  [APP__SET_TOP_DESTINATION_COUNTRIES_LOADING](state, action) {
    const { topNodesKeys, loading } = action.payload;
    const loadingNodes = {};
    topNodesKeys.forEach(n => {
      loadingNodes[n] = loading;
    });
    return {
      ...state,
      loading: {
        ...state.loading,
        topCountries: {
          ...state.loading.topCountries,
          ...loadingNodes
        }
      }
    };
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
  tooltips: PropTypes.object,
  tooltipCheck: PropTypes.number,
  sankeySize: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedYears: PropTypes.arrayOf(PropTypes.number)
});

export default createReducer(initialState, appReducer, appReducerTypes);
