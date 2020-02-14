/* eslint-disable camelcase */
import { connect } from 'react-redux';
import ToolBar from './tool-bar.component';
import { getToolBar } from './tool-bar.selectors';

const getEditPanels = () =>
  import('../../nodes-panel/nodes-panel.register').then(module => module.editPanels);
const getSetActiveModal = () =>
  import('../../tool/tool.actions').then(module => module.setActiveModal);
const getSetLogisticsMapActiveModal = () =>
  import('../../logistics-map/logistics-map.register').then(
    module => module.setLogisticsMapActiveModal
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
  },
  companies_onClick: id => {
    getSetLogisticsMapActiveModal().then(setLogisticsMapActiveModal =>
      dispatch(setLogisticsMapActiveModal(id))
    );
  },
  download_onClick: id => {
    getSetLogisticsMapActiveModal().then(setLogisticsMapActiveModal =>
      dispatch(setLogisticsMapActiveModal(id))
    );
  },
  hubs_onClick: id => {
    getSetLogisticsMapActiveModal().then(setLogisticsMapActiveModal =>
      dispatch(setLogisticsMapActiveModal(id))
    );
  },
  inspectionLevels_onClick: id => {
    getSetLogisticsMapActiveModal().then(setLogisticsMapActiveModal =>
      dispatch(setLogisticsMapActiveModal(id))
    );
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolBar);
