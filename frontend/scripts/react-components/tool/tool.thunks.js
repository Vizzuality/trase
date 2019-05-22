import { loadDisclaimer, resize } from 'actions/app.actions';
import { GET_COLUMNS, loadMapVectorData, loadNodes, loadLinks } from 'scripts/actions/tool.actions';
import {
  GET_COLUMNS_URL,
  GET_ALL_NODES_URL,
  getURLFromParams
} from 'scripts/utils/getURLFromParams';

export const loadDisclaimerTool = dispatch => dispatch(loadDisclaimer());

export const resizeSankeyTool = dispatch => dispatch(resize());

export const loadToolInitialData = (dispatch, getState) => {
  const state = getState();

  if (!state.app.selectedContext || state.toolLinks.nodesDict) {
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
