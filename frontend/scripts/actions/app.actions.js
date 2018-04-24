import isEmpty from 'lodash/isEmpty';
import { TOGGLE_MAP } from 'actions/tool.actions';
import {
  GET_DISCLAIMER_URL,
  GET_SITE_DIVE_URL,
  GET_NODES_WITH_SEARCH_URL,
  getURLFromParams
} from 'utils/getURLFromParams';

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

export function displayStoryModal(storyId) {
  return dispatch => {
    fetch(`${getURLFromParams(GET_SITE_DIVE_URL)}/${storyId}`)
      .then(resp => {
        if (resp.ok) return resp.text();
        throw new Error(resp.statusText);
      })
      .then(resp => JSON.parse(resp))
      .then(({ data }) =>
        dispatch({
          type: DISPLAY_STORY_MODAL,
          payload: {
            visibility: true,
            modalParams: data
          }
        })
      )
      .catch(err => {
        console.error('Error loading site dive.', err);
      });
  };
}

export function resetSearchResults() {
  return {
    type: SET_SEARCH_TERM,
    payload: { term: '', results: [] }
  };
}

export function loadSearchResults(searchTerm) {
  return dispatch => {
    const url = `${getURLFromParams(GET_NODES_WITH_SEARCH_URL)}?query=${searchTerm}`;

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
