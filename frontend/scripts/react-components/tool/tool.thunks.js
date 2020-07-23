import { batch } from 'react-redux';
import { appActions } from 'app/app.register';
import { toolLinksActions } from 'react-components/tool-links/tool-links.register';
import { nodesPanelActions } from 'react-components/nodes-panel/nodes-panel.register';

export const loadDisclaimerTool = dispatch => dispatch(appActions.loadDisclaimer());

export const resizeSankeyTool = dispatch => dispatch(appActions.resize());

export const loadToolInitialData = (dispatch, getState, bag) => {
  if (bag?.action?.meta?.location?.kind !== 'redirect') {
    batch(() => {
      dispatch(toolLinksActions.getToolColumns());
      dispatch(nodesPanelActions.getMissingItems());
    });
  }
};
