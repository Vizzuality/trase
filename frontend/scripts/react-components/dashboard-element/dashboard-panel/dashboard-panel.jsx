import { connect } from 'react-redux';
import { goToDashboard as goToDashboardFn } from 'react-components/dashboard-element/dashboard-element.actions';
import DashboardPanel from 'react-components/dashboard-element/dashboard-panel/dashboard-panel.component';
import {
  getIsDisabled,
  getDraftDynamicSentence
} from 'react-components/dashboard-element/dashboard-element.selectors';
import { getCountryNamesByCountryId } from 'reducers/app.selectors';
import {
  clearPanel,
  setSelectedItems,
  savePanels as savePanelsFn
} from 'react-components/nodes-panel/nodes-panel.actions';

const mapStateToProps = (state, ownProps) => {
  const { loading } = state.dashboardElement;

  return {
    loading,
    isDisabled: getIsDisabled(state, ownProps),
    dynamicSentenceParts: getDraftDynamicSentence(state),
    countryNames: getCountryNamesByCountryId(state)
  };
};

const mapDispatchToProps = {
  clearPanel,
  setSelectedItems,
  goToDashboard: goToDashboardFn,
  savePanels: savePanelsFn
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPanel);
