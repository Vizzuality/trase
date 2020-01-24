import { connect } from 'react-redux';
import { resetSankey } from 'react-components/tool-links/tool-links.register';
import ErrorModal from 'react-components/tool/error-modal/error-modal.component';

const mapDispatchToProps = { resetSankey };

export default connect(
  null,
  mapDispatchToProps
)(ErrorModal);
