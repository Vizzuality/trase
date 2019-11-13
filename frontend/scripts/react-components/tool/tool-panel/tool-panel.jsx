import { connect } from 'react-redux';
import { getDraftDynamicSentence } from 'react-components/dashboard-element/dashboard-element.selectors';
import { getIsDisabled } from 'react-components/tool/tool-panel/tool-panel.selectors';
import { getCanProceed } from 'react-components/nodes-panel/nodes-panel.selectors';
import { getCountryNamesByCountryId } from 'reducers/app.selectors';
import {
  clearPanel,
  setSelectedItems,
  savePanels
} from 'react-components/nodes-panel/nodes-panel.actions';
import { setActiveModal as setActiveModalFn } from 'react-components/tool/tool.actions';
import DashboardPanel from 'react-components/dashboard-element/dashboard-panel/dashboard-panel.component';

const mapStateToProps = (state, ownProps) => ({
  loading: state.dashboardElement.loading,
  isDisabled: getIsDisabled(state, ownProps),
  dynamicSentenceParts: getDraftDynamicSentence(state),
  countryNames: getCountryNamesByCountryId(state),
  canProceed: getCanProceed(state)
});

const mapDispatchToProps = {
  clearPanel,
  setActiveModal: setActiveModalFn,
  setSelectedItems,
  savePanels
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPanel);
