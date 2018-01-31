import { connect } from 'react-redux';
import ProfileRoot from 'react-components/profile-root/profile-root.component';

function mapStateToProps(state) {
  return {
    nodes: state.profileRoot.nodes,
    errorMessage: state.profileRoot.errorMessage
  };
}

export default connect(mapStateToProps)(ProfileRoot);
