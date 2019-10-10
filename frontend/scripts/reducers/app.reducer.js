import {
  DISPLAY_STORY_MODAL,
  LOAD_SEARCH_RESULTS,
  LOAD_TOOLTIP,
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
  APP__SET_TOP_DESTINATION_COUNTRIES_LOADING,
  APP__SET_COLUMNS,
  APP__SET_COLUMNS_LOADING
} from 'actions/app.actions';
import { COUNTRIES_COORDINATES } from 'scripts/countries';
import createReducer from 'utils/createReducer';
import { SELECT_YEARS } from 'react-components/tool/tool.actions';
import { TOOL_LINKS_RESET_SANKEY } from 'react-components/tool-links/tool-links.actions';
import { deserialize } from 'react-components/shared/url-serializer/url-serializer.component';
import immer from 'immer';
import initialState from './app.initial-state';

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
    const { topContextCountries } = action.payload;
    const { contexts } = state;

    const getNodes = (countries, contextCountryName) =>
      countries.map(c => ({
        id: c.id,
        value: c.attribute.value,
        height: c.attribute.height,
        coordinates: COUNTRIES_COORDINATES[c.geo_id],
        geoId: c.geo_id,
        name: contextCountryName === c.name ? 'DOMESTIC CONSUMPTION' : c.name,
        otherIndicators: c.other_attributes
      }));

    const newTopCountries = {};
    topContextCountries.forEach(c => {
      const countryContext = contexts.find(context => c.context_id === context.id);
      newTopCountries[c.context_id] = getNodes(c.top_nodes, countryContext?.countryName);
    });
    return {
      ...state,
      topNodes: {
        ...state.topNodes,
        ...newTopCountries
      }
    };
  },
  [APP__SET_TOP_DESTINATION_COUNTRIES_LOADING](state, action) {
    const { loading } = action.payload;
    return {
      ...state,
      loading: {
        ...state.loading,
        topCountries: loading
      }
    };
  },
  [APP__SET_COLUMNS_LOADING](state, action) {
    const { loading } = action.payload;
    return {
      ...state,
      loading: {
        ...state.loading,
        columns: loading
      }
    };
  },
  [APP__SET_COLUMNS](state, action) {
    return immer(state, draft => {
      const { columns } = action.payload;

      // TODO the API should have the info on which file to load (if any) per column
      const municipalitiesColumn = columns.find(column => column.name === 'MUNICIPALITY');
      const logisticsHubColumn = columns.find(column => column.name === 'LOGISTICS HUB');
      if (logisticsHubColumn && municipalitiesColumn) {
        logisticsHubColumn.useGeometryFromColumnId = municipalitiesColumn.id;
      }

      draft.data.columns = {};
      columns.forEach(column => {
        draft.data.columns[column.id] = column;
      });

      // TODO: if any selectedNode, make those columns visible (selected)
    });
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
  selectedYears: PropTypes.arrayOf(PropTypes.number)
});

export default createReducer(initialState, appReducer, appReducerTypes);
