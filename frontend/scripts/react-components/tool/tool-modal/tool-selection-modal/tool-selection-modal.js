import { connect } from 'react-redux';
import ToolPanelComponent from 'react-components/tool/tool-modal/tool-selection-modal/tool-selection-modal.component';
import { setActiveModal } from 'react-components/tool/tool.actions';
import { getCanProceed } from 'react-components/nodes-panel/nodes-panel.selectors';

const mapStateToProps = state => ({
  canProceed: getCanProceed(state)
});

const mapDispatchToProps = {
  setActiveModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolPanelComponent);
