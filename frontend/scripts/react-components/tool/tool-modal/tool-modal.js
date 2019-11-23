import { connect, batch } from 'react-redux';
import ToolModal from 'react-components/tool/tool-modal/tool-modal.component';
import { setActiveModal } from 'react-components/tool/tool.actions';
import {
  selectResizeBy,
  selectRecolorBy,
  setToolFlowsLoading
} from 'react-components/tool-links/tool-links.actions';
import { cancelPanelsDraft, savePanels } from 'react-components/nodes-panel/nodes-panel.actions';
import { getItems, getSelectedItem } from 'react-components/tool/tool-modal/tool-modal.selectors';

const mapStateToProps = state => ({
  items: getItems(state),
  selectedItem: getSelectedItem(state)
});

const mapDispatchToProps = (dispatch, ownProps) => {
  const onChange = {
    indicator: recolorBy => {
      batch(() => {
        dispatch(setToolFlowsLoading(true));
        dispatch(selectRecolorBy(recolorBy));
        dispatch(setActiveModal(null));
      });
    },
    unit: resizeBy => {
      batch(() => {
        dispatch(selectResizeBy(resizeBy));
        dispatch(setActiveModal(null));
      });
    }
  }[ownProps.activeModal];
  return {
    onChange,
    savePanels: () => dispatch(savePanels()),
    cancelPanelsDraft: () => dispatch(cancelPanelsDraft()),
    setActiveModal: activeModalId => dispatch(setActiveModal(activeModalId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolModal);
