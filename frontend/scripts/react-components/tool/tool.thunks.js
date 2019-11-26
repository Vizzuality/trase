import { batch } from 'react-redux';
import { loadDisclaimer, resize } from 'actions/app.actions';
import { getToolColumns } from 'react-components/tool-links/tool-links.actions';
import { getMissingItems } from 'react-components/nodes-panel/nodes-panel.actions';

export const loadDisclaimerTool = dispatch => dispatch(loadDisclaimer());

export const resizeSankeyTool = dispatch => dispatch(resize());

export const loadToolInitialData = (dispatch, getState, bag) => {
  if (bag?.action?.meta?.location?.kind !== 'redirect') {
    batch(() => {
      dispatch(getToolColumns());
      dispatch(getMissingItems());
    });
  }
};
