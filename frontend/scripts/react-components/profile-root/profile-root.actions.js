import { GET_ALL_NODES, getURLFromParams } from 'utils/getURLFromParams';
import values from 'lodash/values';
import { DEFAULT_PROFILE_PAGE_YEAR } from 'constants';
import capitalize from 'lodash/capitalize';

export const SET_PROFILE_SEARCH_NODES = 'SET_PROFILE_SEARCH_NODES';
export const SET_PROFILE_SEARCH_ERROR_MESSAGE = 'SET_PROFILE_SEARCH_ERROR_MESSAGE';

export const goToNodeProfilePage = node => dispatch =>
  dispatch({
    type: `profile${capitalize(node.profileType)}`,
    payload: { query: { nodeId: node.id, year: DEFAULT_PROFILE_PAGE_YEAR } }
  });

export const loadProfileRootNodes = () => dispatch => {
  const allNodesURL = getURLFromParams(GET_ALL_NODES, { context_id: 1 });

  fetch(allNodesURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(new Error(response.statusText));
    })
    .then(result => {
      if (!result) return;

      const nodesArray = values(result.data).filter(
        node =>
          node.isUnknown !== true &&
          node.isAggregated !== true &&
          node.isDomesticConsumption !== true &&
          !!node.profileType
      );

      dispatch({
        type: SET_PROFILE_SEARCH_NODES,
        payload: { nodes: nodesArray }
      });
    })
    .catch(reason => {
      console.error('Error loading profile search nodes', reason);
      dispatch({
        type: SET_PROFILE_SEARCH_ERROR_MESSAGE,
        payload: { errorMessage: reason.message }
      });
    });
};
