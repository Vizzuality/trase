import { loadDisclaimer, resize } from 'actions/app.actions';
import {
  GET_COLUMNS,
  RESET_TOOL_LOADERS,
  loadMapVectorData,
  loadNodes,
  loadLinks
} from 'scripts/actions/tool.actions';
import {
  GET_COLUMNS_URL,
  GET_ALL_NODES_URL,
  getURLFromParams
} from 'scripts/utils/getURLFromParams';

// TODO: custom container prevents from optimizing this
// currently we need to load initial data every time we enter the page
// the implementation of the vanilla redux container doesn't pass existing props to the sankey
// passes callbacks that after execution assign values to local variables
// This means that we need to wait for the new data to load when re-entering to the flows page
// and the contextId has changed.
// In order to avoid adding loading states when not needed we check that the selectedContext
// has indeed changed.

export const setToolLoaders = dispatch =>
  dispatch({
    type: RESET_TOOL_LOADERS
  });

export const loadDisclaimerTool = dispatch => dispatch(loadDisclaimer());

export const resizeSankeyTool = dispatch => dispatch(resize());

export const loadToolInitialData = (dispatch, getState) => {
  const state = getState();
  if (!state.app.selectedContext) {
    return;
  }

  const params = {
    context_id: state.app.selectedContext.id
  };
  const allNodesURL = getURLFromParams(GET_ALL_NODES_URL, params);
  const columnsURL = getURLFromParams(GET_COLUMNS_URL, params);
  const promises = [allNodesURL, columnsURL].map(url => fetch(url).then(resp => resp.json()));

  Promise.all(promises).then(payload => {
    // TODO do not wait for end of all promises/use another .all call
    dispatch({
      type: GET_COLUMNS,
      payload
    });

    dispatch(loadLinks());
    dispatch(loadNodes());
    dispatch(loadMapVectorData());
  });
};
