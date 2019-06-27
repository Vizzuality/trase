import { loadDisclaimer, resize } from 'actions/app.actions';
import { getToolColumns } from 'react-components/tool-links/tool-links.actions';

export const loadDisclaimerTool = dispatch => dispatch(loadDisclaimer());

export const resizeSankeyTool = dispatch => dispatch(resize());

export const loadToolInitialData = (dispatch, getState, bag) => {
  if (bag?.action?.meta?.location?.kind !== 'redirect') {
    dispatch(getToolColumns());
  }
};
