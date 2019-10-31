import { connect } from 'react-redux';
import {
  getIsDisabled,
  getDynamicSentence
} from 'react-components/tool/tool-modal/tool-selection-modal/tool-panel/tool-panel.selectors';
import ToolSelectionModal from 'react-components/tool/tool-modal/tool-selection-modal/tool-panel/tool-panel.component';
import { getCanProceed } from 'react-components/nodes-panel/nodes-panel.selectors';
import { getCountryNamesByCountryId } from 'reducers/app.selectors';
import { clearPanel, setSelectedItems } from 'react-components/nodes-panel/nodes-panel.actions';

const mapStateToProps = (state, ownProps) => {
  const { loading } = state.dashboardElement;

  return {
    loading,
    isDisabled: getIsDisabled(state, ownProps),
    dynamicSentenceParts: getDynamicSentence(state),
    countryNames: getCountryNamesByCountryId(state),
    canProceed: getCanProceed(state)
  };
};

const mapDispatchToProps = {
  clearPanel,
  setSelectedItems
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolSelectionModal);
