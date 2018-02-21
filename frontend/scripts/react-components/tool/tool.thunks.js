import { loadInitialData } from 'actions/tool.actions';
import { displayStoryModal, loadDisclaimer, resize } from 'actions/app.actions';

export const loadDisclaimerTool = dispatch => dispatch(loadDisclaimer());
export const loadInitialDataTool = (dispatch, getState) => {
  const { app, tool } = getState();
  const hasInitialData = app.tooltips && tool.contexts.length > 0;
  return !hasInitialData && dispatch(loadInitialData());
};
export const resizeSankeyTool = dispatch => dispatch(resize());
export const loadStoryModalTool = (dispatch, getState) => {
  const { query } = getState().location;
  return query.story && dispatch(displayStoryModal(query.story));
};
