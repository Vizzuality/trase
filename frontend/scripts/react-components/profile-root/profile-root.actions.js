import { GET_NODES_WITH_SEARCH_URL, getURLFromParams } from 'utils/getURLFromParams';
import isEmpty from 'lodash/isEmpty';
import axios from 'axios';

export const SET_PROFILE_SEARCH_TERM = 'SET_PROFILE_SEARCH_TERM';
export const LOAD_PROFILE_SEARCH_RESULTS = 'LOAD_PROFILE_SEARCH_RESULTS';
export const SET_PROFILE_ROOT_ERROR_MESSAGE = 'SET_PROFILE_ROOT_ERROR_MESSAGE';
export const GET_TOP_PROFILES = 'GET_TOP_PROFILES';
export const SET_TOP_PROFILES = 'SET_TOP_PROFILES';

export const goToNodeProfilePage = node => ({
  type: 'profileNode',
  payload: {
    query: {
      nodeId: node.id,
      contextId: node.contextId
    },
    profileType: node.profile
  }
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

  axios(nodeResultsURL)
    .then(res => {
      const results = res.data;
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

export const getTopProfiles = () => dispatch => {
  const topProfilesURL = getURLFromParams(GET_TOP_PROFILES);
  axios(topProfilesURL)
    .then(res => {
      const results = res.data;
      if (!results) return;
      dispatch({
        type: SET_TOP_PROFILES,
        payload: results.data
      });
    })
    .catch(reason => {
      console.error('Error loading top profiles', reason);
      dispatch({
        type: SET_PROFILE_ROOT_ERROR_MESSAGE,
        payload: {
          errorMessage: reason.message
        }
      });
    });
};
