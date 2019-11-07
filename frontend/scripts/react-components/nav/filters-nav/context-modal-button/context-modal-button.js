import { connect } from 'react-redux';
import ContextModalButton from 'react-components/nav/filters-nav/context-modal-button/context-modal-button.component';
import { setActiveModal } from 'react-components/tool/tool.actions';

const mapDispatchToProps = { setActiveModal };

export default connect(
  null,
  mapDispatchToProps
)(ContextModalButton);
