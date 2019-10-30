import { connect } from 'react-redux';
import ToolSelectionModalButton from 'react-components/nav/filters-nav/tool-selection-modal-button/tool-selection-modal-button.component';
import { setActiveModal } from 'react-components/tool/tool.actions';

const mapDispatchToProps = { setActiveModal };

export default connect(
  null,
  mapDispatchToProps
)(ToolSelectionModalButton);
