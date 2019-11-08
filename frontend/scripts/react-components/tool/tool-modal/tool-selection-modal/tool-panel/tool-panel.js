import { connect, batch } from 'react-redux';
import { getDraftDynamicSentence } from 'react-components/dashboard-element/dashboard-element.selectors';

import { getIsDisabled } from 'react-components/tool/tool-modal/tool-selection-modal/tool-panel/tool-panel.selectors';
import ToolSelectionModal from 'react-components/tool/tool-modal/tool-selection-modal/tool-panel/tool-panel.component';
import { getCanProceed } from 'react-components/nodes-panel/nodes-panel.selectors';
import { getCountryNamesByCountryId } from 'reducers/app.selectors';
import {
  clearPanel,
  setSelectedItems,
  savePanels
} from 'react-components/nodes-panel/nodes-panel.actions';
import { selectContextById } from 'actions/app.actions';

const mapStateToProps = (state, ownProps) => {
  const { loading } = state.dashboardElement;

  return {
    loading,
    isDisabled: getIsDisabled(state, ownProps),
    dynamicSentenceParts: getDraftDynamicSentence(state),
    countryNames: getCountryNamesByCountryId(state),
    canProceed: getCanProceed(state)
  };
};

const mapDispatchToProps = dispatch => ({
  clearPanel: panel => dispatch(clearPanel(panel)),
  setSelectedItems: (activeItem, name) => dispatch(setSelectedItems(activeItem, name)),
  savePanels: contextId =>
    batch(() => {
      dispatch(savePanels());
      dispatch(selectContextById(contextId));
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolSelectionModal);
