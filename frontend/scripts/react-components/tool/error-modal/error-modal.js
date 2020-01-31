import { connect } from 'react-redux';
import { toolLinksActions } from 'react-components/tool-links/tool-links.register';
import ErrorModal from 'react-components/tool/error-modal/error-modal.component';

const mapDispatchToProps = { resetSankey: toolLinksActions.resetSankey };

export default connect(null, mapDispatchToProps)(ErrorModal);
