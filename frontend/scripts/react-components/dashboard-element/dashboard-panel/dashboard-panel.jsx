import { connect } from 'react-redux';
import { goToDashboard as goToDashboardFn } from 'react-components/dashboard-element/dashboard-element.actions';
import DashboardPanel from 'react-components/dashboard-element/dashboard-panel/dashboard-panel.component';
import {
  getIsDisabled,
  getDynamicSentence
} from 'react-components/dashboard-element/dashboard-element.selectors';
import { getCountryNamesByCountryId } from 'reducers/app.selectors';
import { clearPanel, setSelectedItems } from 'react-components/nodes-panel/nodes-panel.actions';

const mapStateToProps = (state, ownProps) => {
  const { loading } = state.dashboardElement;

  return {
    loading,
    isDisabled: getIsDisabled(state, ownProps),
    dynamicSentenceParts: getDynamicSentence(state),
    countryNames: getCountryNamesByCountryId(state)
  };
};

const mapDispatchToProps = {
  clearPanel,
  setSelectedItems,
  goToDashboard: goToDashboardFn
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPanel);
