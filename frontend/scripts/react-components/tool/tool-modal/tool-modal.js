import { connect, batch } from 'react-redux';
import ToolModal from 'react-components/tool/tool-modal/tool-modal.component';
import { toolLayersActions } from 'react-components/tool-layers/tool-layers.register';
import { toolLinksActions } from 'react-components/tool-links/tool-links.register';
import { nodesPanelActions } from 'react-components/nodes-panel/nodes-panel.register';
import { getItems, getSelectedItem } from 'react-components/tool/tool-modal/tool-modal.selectors';

const mapStateToProps = state => ({
  items: getItems(state),
  selectedItem: getSelectedItem(state)
});

const mapDispatchToProps = (dispatch, ownProps) => {
  const onChange = {
    indicator: recolorBy => {
      batch(() => {
        dispatch(toolLinksActions.setToolFlowsLoading(true));
        dispatch(toolLinksActions.setToolChartsLoading(true));
        dispatch(toolLinksActions.selectRecolorBy(recolorBy));
        dispatch(toolLayersActions.setActiveModal(null));
      });
    },
    unit: resizeBy => {
      batch(() => {
        dispatch(toolLinksActions.selectResizeBy(resizeBy));
        dispatch(toolLayersActions.setActiveModal(null));
      });
    },
    viewMode: viewMode => {
      dispatch(toolLinksActions.selectView(viewMode.value));
      dispatch(toolLayersActions.setActiveModal(null));
    }
  }[ownProps.activeModal];
  return {
    onChange,
    finishSelection: () => dispatch(nodesPanelActions.finishSelection()),
    setActiveModal: activeModalId => dispatch(toolLayersActions.setActiveModal(activeModalId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolModal);
