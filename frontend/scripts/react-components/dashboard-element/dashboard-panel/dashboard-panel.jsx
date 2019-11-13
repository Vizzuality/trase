import { connect } from 'react-redux';
import { goToDashboard } from 'react-components/dashboard-element/dashboard-element.actions';
import DashboardPanel from 'react-components/dashboard-element/dashboard-panel/dashboard-panel.component';
import {
  getIsDisabled,
  getDraftDynamicSentence
} from 'react-components/dashboard-element/dashboard-element.selectors';
import { getCountryNamesByCountryId } from 'reducers/app.selectors';
import {
  clearPanel,
  setSelectedItems,
  savePanels,
  cancelPanelsDraft
} from 'react-components/nodes-panel/nodes-panel.actions';
import { getCanProceed } from 'react-components/nodes-panel/nodes-panel.selectors';

const mapStateToProps = (state, ownProps) => {
  const { loading } = state.dashboardElement;

  return {
    loading,
    canProceed: getCanProceed(state),
    isDisabled: getIsDisabled(state, ownProps),
    dynamicSentenceParts: getDraftDynamicSentence(state),
    countryNames: getCountryNamesByCountryId(state)
  };
};

const mapDispatchToProps = {
  clearPanel,
  savePanels,
  goToDashboard,
  setSelectedItems,
  cancelPanelsDraft
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPanel);
