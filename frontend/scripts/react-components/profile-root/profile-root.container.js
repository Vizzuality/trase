import { connect } from 'react-redux';
import ProfileRoot from 'react-components/profile-root/profile-root.component';

function mapStateToProps(state) {
  return {
    errorMessage: state.profileRoot.errorMessage
  };
}

export default connect(mapStateToProps)(ProfileRoot);
