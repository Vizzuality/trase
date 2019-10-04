import { loadDisclaimer, resize, getToolColumns } from 'actions/app.actions';

export const loadDisclaimerTool = dispatch => dispatch(loadDisclaimer());

export const resizeSankeyTool = dispatch => dispatch(resize());

export const loadToolInitialData = (dispatch, getState, bag) => {
  if (bag?.action?.meta?.location?.kind !== 'redirect') {
    dispatch(getToolColumns());
  }
};
