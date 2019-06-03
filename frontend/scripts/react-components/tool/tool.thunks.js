import { loadDisclaimer, resize } from 'actions/app.actions';
import { loadNodes } from 'react-components/tool/tool.actions';
import { getToolColumns } from 'react-components/tool-links/tool-links.actions';

export const loadDisclaimerTool = dispatch => dispatch(loadDisclaimer());

export const resizeSankeyTool = dispatch => dispatch(resize());

export const loadToolInitialData = (dispatch, getState) => {
  const state = getState();

  if (!state.app.selectedContext || state.toolLinks.data.links) {
    return;
  }

  dispatch(getToolColumns());
  dispatch(loadNodes());
};
