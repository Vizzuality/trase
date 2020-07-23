/* eslint-disable camelcase */
import { connect } from 'react-redux';
import ToolBar from './tool-bar.component';
import { getToolBar } from './tool-bar.selectors';

const getEditPanels = () =>
  import('../../nodes-panel/nodes-panel.register').then(
    module => module.nodesPanelActions.editPanels
  );
const getSetActiveModal = () =>
  import('../../tool-layers/tool-layers.register').then(
    module => module.toolLayersActions.setActiveModal
  );

const mapStateToProps = state => {
  const { left, right } = getToolBar(state);
  return {
    leftSlot: left,
    rightSlot: right
  };
};

const mapDispatchToProps = dispatch => ({
  context_onClick: () => {
    Promise.all([getEditPanels(), getSetActiveModal()]).then(([editPanels, setActiveModal]) => {
      dispatch(editPanels());
      dispatch(setActiveModal('context'));
    });
  },
  viewMode_onClick: id => {
    getSetActiveModal().then(setActiveModal => dispatch(setActiveModal(id)));
  },
  version_onClick: id => {
    getSetActiveModal().then(setActiveModal => dispatch(setActiveModal(id)));
  },
  unit_onClick: id => {
    getSetActiveModal().then(setActiveModal => dispatch(setActiveModal(id)));
  },
  indicator_onClick: id => {
    getSetActiveModal().then(setActiveModal => dispatch(setActiveModal(id)));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ToolBar);
