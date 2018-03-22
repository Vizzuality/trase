import { loadInitialData, setDefaultContext } from 'actions/tool.actions';
import { displayStoryModal, loadDisclaimer, resize } from 'actions/app.actions';

// TODO: custom container prevents from optimizing this
// currently we need to load initial data everytime we enter the page
// the implementation of the vanilla redux container doesn't pass existing props to the sankey
// passes callbacks that after execution assign values to local variables

export const loadDisclaimerTool = async dispatch => dispatch(loadDisclaimer());

export const loadInitialDataTool = async dispatch =>
  dispatch(loadInitialData(true)).then(() => dispatch(setDefaultContext()));

export const resizeSankeyTool = async dispatch => dispatch(resize());

export const loadStoryModalTool = async (dispatch, getState) => {
  const { query = {} } = getState().location;
  return query.story && dispatch(displayStoryModal(query.story));
};
