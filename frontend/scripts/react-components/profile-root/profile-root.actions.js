import { GET_NODES_WITH_SEARCH_URL, getURLFromParams } from 'utils/getURLFromParams';
import { DEFAULT_PROFILE_PAGE_YEAR } from 'constants';
import capitalize from 'lodash/capitalize';
import isEmpty from 'lodash/isEmpty';

export const SET_PROFILE_SEARCH_TERM = 'SET_PROFILE_SEARCH_TERM';
export const LOAD_PROFILE_SEARCH_RESULTS = 'LOAD_PROFILE_SEARCH_RESULTS';
export const SET_PROFILE_ROOT_ERROR_MESSAGE = 'SET_PROFILE_ROOT_ERROR_MESSAGE';

export const goToNodeProfilePage = node => dispatch =>
  dispatch({
    type: `profile${capitalize(node.profile)}`,
    payload: { query: { nodeId: node.id, year: DEFAULT_PROFILE_PAGE_YEAR } }
  });

export function resetProfileSearchResults() {
  return {
    type: SET_PROFILE_SEARCH_TERM,
    payload: { term: '', results: [] }
  };
}

export const searchNodeWithTerm = searchTerm => dispatch => {
  const nodeResultsURL = getURLFromParams(GET_NODES_WITH_SEARCH_URL, {
    query: searchTerm,
    context_id: 1,
    profile_only: true
  });

  if (isEmpty(searchTerm)) {
    dispatch(resetProfileSearchResults());
    return;
  }

  dispatch({
    type: SET_PROFILE_SEARCH_TERM,
    payload: { term: searchTerm, isLoading: true }
  });

  fetch(nodeResultsURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(new Error(response.statusText));
    })
    .then(results => {
      if (!results) return;

      dispatch({
        type: LOAD_PROFILE_SEARCH_RESULTS,
        payload: results.data
      });
    })
    .catch(reason => {
      console.error('Error loading profile search nodes', reason);
      dispatch({
        type: SET_PROFILE_ROOT_ERROR_MESSAGE,
        payload: { errorMessage: reason.message }
      });
    });
};
