import { connect } from 'react-redux';
import { getSelectedContext } from 'reducers/app.selectors';
import ToolSelectionModalButton from 'react-components/nav/filters-nav/tool-selection-modal-button/tool-selection-modal-button.component';
import { setActiveModal } from 'react-components/tool/tool.actions';
import { editPanels } from 'react-components/nodes-panel/nodes-panel.actions';

const mapStateToProps = state => ({
  selectedContext: getSelectedContext(state)
});

const mapDispatchToProps = { setActiveModal, editPanels };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolSelectionModalButton);
