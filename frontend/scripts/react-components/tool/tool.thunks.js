import { loadInitialData } from 'actions/tool.actions';
import { displayStoryModal, loadDisclaimer, resize } from 'actions/app.actions';

// TODO: custom container prevents from optimizing this
// currently we need to load initial data everytime we enter the page
// the implementation of the vanilla redux container doesn't pass existing props to the sankey
// passes callbacks that after execution assign values to local variables

export const loadDisclaimerTool = dispatch => dispatch(loadDisclaimer());

export const loadInitialDataTool = dispatch => dispatch(loadInitialData());

export const resizeSankeyTool = dispatch => dispatch(resize());

export const loadStoryModalTool = (dispatch, getState) => {
  const { query } = getState().location;
  return query.story && dispatch(displayStoryModal(query.story));
};
