import isEmpty from 'lodash/isEmpty';
import {
  GET_DISCLAIMER_URL,
  GET_NODES_WITH_SEARCH_URL,
  GET_TOP_NODES_URL,
  getURLFromParams
} from 'utils/getURLFromParams';
import { TOGGLE_MAP, SELECT_YEARS } from 'react-components/tool/tool.actions';
import getPageTitle from 'scripts/router/page-title';
import { redirect } from 'redux-first-router';
import getTopNodesKey from 'utils/getTopNodesKey';
import { getSelectedContext, getSelectedYears } from 'reducers/app.selectors';

export const SET_CONTEXT = 'SET_CONTEXT';
export const DISPLAY_STORY_MODAL = 'DISPLAY_STORY_MODAL';
export const LOAD_TOOLTIP = 'LOAD_TOOLTIP';
export const SET_SANKEY_SIZE = 'SET_SANKEY_SIZE';
export const SET_TOOLTIPS = 'SET_TOOLTIPS';
export const SHOW_DISCLAIMER = 'SHOW_DISCLAIMER';
export const TOGGLE_DROPDOWN = 'TOGGLE_DROPDOWN';
export const TOGGLE_MAP_LAYERS_MENU = 'TOGGLE_MAP_LAYERS_MENU';
export const CLOSE_STORY_MODAL = 'CLOSE_STORY_MODAL';
export const SET_SEARCH_TERM = 'SET_SEARCH_TERM';
export const LOAD_SEARCH_RESULTS = 'LOAD_SEARCH_RESULTS';
export const SET_CONTEXTS = 'SET_CONTEXTS';
export const SET_CONTEXT_IS_USER_SELECTED = 'SET_CONTEXT_IS_USER_SELECTED';
export const APP__SET_LOADING = 'APP__SET_LOADING';
export const APP__TRANSIFEX_LANGUAGES_LOADED = 'APP__TRANSIFEX_LANGUAGES_LOADED';
export const APP__SET_TOP_DESTINATION_COUNTRIES = 'APP__SET_TOP_DESTINATION_COUNTRIES';
export const APP__SET_TOP_DESTINATION_COUNTRIES_LOADING =
  'APP__SET_TOP_DESTINATION_COUNTRIES_LOADING';

export function setContextIsUserSelected(contextIsUserSelected) {
  return {
    type: SET_CONTEXT_IS_USER_SELECTED,
    payload: contextIsUserSelected
  };
}

export function selectContextById(contextId) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_CONTEXT,
      payload: contextId
    });

    dispatch(setContextIsUserSelected(true));

    document.title = getPageTitle(getState());
  };
}

export function resize() {
  return {
    type: SET_SANKEY_SIZE
  };
}

export function toggleMap(forceState = null) {
  return dispatch => {
    dispatch({
      type: TOGGLE_MAP,
      forceState
    });
    dispatch({ type: SET_SANKEY_SIZE });
  };
}

export function toggleMapLayerMenu() {
  return dispatch => {
    dispatch({
      type: TOGGLE_MAP_LAYERS_MENU
    });
    dispatch({ type: SET_SANKEY_SIZE });
  };
}

export function loadTooltip() {
  return {
    type: LOAD_TOOLTIP
  };
}

export function closeStoryModal() {
  return {
    type: CLOSE_STORY_MODAL
  };
}

export function loadDisclaimer() {
  return dispatch => {
    const disclaimerLocal = localStorage.getItem('disclaimerVersion');

    const url = getURLFromParams(GET_DISCLAIMER_URL);
    fetch(url)
      .then(resp => resp.text())
      .then(resp => JSON.parse(resp))
      .then(disclaimer => {
        if (disclaimerLocal !== null && parseInt(disclaimerLocal, 10) >= disclaimer.version) {
          return;
        }

        localStorage.setItem('disclaimerVersion', disclaimer.version);

        dispatch({
          type: SHOW_DISCLAIMER,
          disclaimerContent: disclaimer.content
        });
      });
  };
}

export function toggleDropdown(dropdownId) {
  return {
    type: TOGGLE_DROPDOWN,
    dropdownId
  };
}

export function resetSearchResults() {
  return {
    type: SET_SEARCH_TERM,
    payload: { term: '', results: [] }
  };
}

export const setLanguage = lang => (dispatch, getState) => {
  const { location } = getState();
  const query = { ...location.query, lang };
  const payload = { ...location.payload, query };
  return dispatch(redirect({ type: location.type, payload }));
};

export function loadSearchResults(searchTerm, contextId) {
  return dispatch => {
    const url = getURLFromParams(GET_NODES_WITH_SEARCH_URL, {
      query: searchTerm,
      context_id: contextId
    });
    if (isEmpty(searchTerm)) {
      dispatch(resetSearchResults());
      return;
    }

    dispatch({
      type: SET_SEARCH_TERM,
      payload: { term: searchTerm, isLoading: true }
    });

    fetch(url)
      .then(resp => resp.json())
      .then(results => {
        dispatch({
          type: LOAD_SEARCH_RESULTS,
          payload: { term: searchTerm, results: results.data }
        });
      })
      .catch(() => {
        dispatch({
          type: LOAD_SEARCH_RESULTS,
          payload: { term: searchTerm, results: [] }
        });
      });
  };
}

export function selectYears(years) {
  return {
    type: SELECT_YEARS,
    payload: { years }
  };
}

export function setTransifexLanguages(languages) {
  return {
    type: APP__TRANSIFEX_LANGUAGES_LOADED,
    payload: { languages }
  };
}

export const getTopCountries = (contexts, options = {}) => (dispatch, getState) => {
  const { fromDefaultYear } = options;
  const state = getState();
  const defaultSelectedContext = getSelectedContext(state);
  if (!defaultSelectedContext) return;
  const selectedContexts = contexts || [defaultSelectedContext];

  const topCountries = [];
  selectedContexts.forEach(selectedContext => {
    const columnId = selectedContext.worldMap.countryColumnId;
    const years = fromDefaultYear
      ? [selectedContext.defaultYear, selectedContext.defaultYear]
      : getSelectedYears(state);
    // eslint-disable-next-line camelcase
    const [start_year, end_year] = years;
    const { topNodes } = state.app;
    const params = {
      start_year,
      end_year,
      column_id: columnId,
      context_id: selectedContext.id
    };
    const topNodesKey = getTopNodesKey(selectedContext.id, 'country', start_year, end_year);
    if (!topNodes[topNodesKey]) {
      topCountries.push({
        topNodesKey,
        country: selectedContext.countryName,
        url: getURLFromParams(GET_TOP_NODES_URL, params)
      });
    }
  });
  if (!topCountries.length) return;

  dispatch({
    type: APP__SET_TOP_DESTINATION_COUNTRIES_LOADING,
    payload: {
      topNodesKeys: topCountries.map(c => c.topNodesKey),
      loading: true
    }
  });

  Promise.all(
    topCountries.map(topCountry =>
      fetch(topCountry.url).then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
    )
  )
    .then(res => {
      dispatch({
        type: APP__SET_TOP_DESTINATION_COUNTRIES,
        payload: {
          topCountries: topCountries.map((c, i) => ({
            topNodesKey: c.topNodesKey,
            country: c.country,
            data: res[i].data
          }))
        }
      });
    })
    .catch(error => console.error(error));
};
