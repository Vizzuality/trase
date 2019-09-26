import { connect } from 'react-redux';
import { resetSankey } from 'react-components/tool-links/tool-links.actions';
import ErrorModal from 'react-components/tool/error-modal/error-modal.component';

const mapDispatchToProps = { resetSankey };

export default connect(
  null,
  mapDispatchToProps
)(ErrorModal);
