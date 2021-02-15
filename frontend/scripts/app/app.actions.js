import isEmpty from 'lodash/isEmpty';
import {
  GET_DISCLAIMER_URL,
  GET_NODES_WITH_SEARCH_URL,
  GET_TOP_NODE_STATS_URL,
  getURLFromParams
} from 'utils/getURLFromParams';
import { CHANGE_LAYOUT, SET_SANKEY_SIZE, SELECT_YEARS } from 'react-components/tool/tool.actions';
import getPageTitle from 'router/page-title';
import { redirect } from 'redux-first-router';
import { getSelectedContext } from 'app/app.selectors';
import axios from 'axios';

export const SET_CONTEXT = 'SET_CONTEXT';
export const LOAD_TOOLTIP = 'LOAD_TOOLTIP';
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
export const APP__SAGA_REGISTERED = 'APP__SAGA_REGISTERED';
export const APP__ON_PDF_DOWNLOAD = 'APP__ON_PDF_DOWNLOAD';

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

export function changeLayout(newToolLayout) {
  return dispatch => {
    dispatch({
      type: CHANGE_LAYOUT,
      payload: {
        toolLayout: newToolLayout
      }
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
    axios
      .get(url)
      .then(resp => resp.data)
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
    const params = { query: searchTerm, ...(contextId ? { context_id: contextId } : {}) };
    if (isEmpty(searchTerm)) {
      dispatch(resetSearchResults());
      return;
    }
    const url = getURLFromParams(GET_NODES_WITH_SEARCH_URL, params);

    dispatch({
      type: SET_SEARCH_TERM,
      payload: { term: searchTerm, isLoading: true }
    });

    axios
      .get(url)
      .then(resp => resp.data)
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

export const getTopCountries = contexts => (dispatch, getState) => {
  const state = getState();
  const defaultSelectedContext = getSelectedContext(state);
  if (!defaultSelectedContext) return;
  const selectedContexts = contexts || [defaultSelectedContext];

  // TODO move into context.worldMap
  const volumeIndicator = selectedContexts[0].resizeBy.find(i => i.name === 'Volume');
  const volumneIndicatorId = volumeIndicator?.attributeId;
  const countryColumnId = selectedContexts[0].worldMap.countryColumnId;

  dispatch({
    type: APP__SET_TOP_DESTINATION_COUNTRIES_LOADING,
    payload: { loading: true }
  });
  const params = {
    contexts_ids: selectedContexts.map(c => c.id).join(),
    attribute_id: volumneIndicatorId,
    column_id: countryColumnId
  };

  const topNodesUrl = getURLFromParams(GET_TOP_NODE_STATS_URL, params);
  axios
    .get(topNodesUrl)
    .then(res => {
      dispatch({
        type: APP__SET_TOP_DESTINATION_COUNTRIES,
        payload: { topContextCountries: res.data.data }
      });
    })
    .catch(error => console.error(error))
    .finally(() =>
      dispatch({
        type: APP__SET_TOP_DESTINATION_COUNTRIES_LOADING,
        payload: { loading: false }
      })
    );
};

export function onDownloadPDF() {
  return {
    type: APP__ON_PDF_DOWNLOAD
  };
}
