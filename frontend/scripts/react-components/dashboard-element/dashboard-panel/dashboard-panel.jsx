import { connect } from 'react-redux';
import DashboardPanel from 'react-components/dashboard-element/dashboard-panel/dashboard-panel.component';
import {
  getIsDisabled,
  getDraftDynamicSentence
} from 'react-components/dashboard-element/dashboard-element.selectors';

import { getCountryNamesByCountryId } from 'app/app.selectors';

import { nodesPanelActions } from 'react-components/nodes-panel/nodes-panel.register';
import { getCanProceed } from 'react-components/nodes-panel/nodes-panel.selectors';

const mapStateToProps = (state, ownProps) => {
  const { loading } = state.dashboardElement;

  return {
    loading,
    canProceed: getCanProceed(state),
    isDisabled: getIsDisabled(state, ownProps),
    draftDynamicSentenceParts: getDraftDynamicSentence(state),
    countryNames: getCountryNamesByCountryId(state)
  };
};

const mapDispatchToProps = {
  clearPanel: nodesPanelActions.clearPanel,
  setSelectedItems: nodesPanelActions.setSelectedItems,
  cancelPanelsDraft: nodesPanelActions.cancelPanelsDraft
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPanel);
