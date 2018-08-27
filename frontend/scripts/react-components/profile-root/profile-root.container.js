import { connect } from 'react-redux';
import ProfileRoot from 'react-components/profile-root/profile-root.component';
import { getContextsWithProfilePages } from 'react-components/profile-root/profile-root.selectors';

function mapStateToProps(state) {
  return {
    getContextsWithProfilePages,
    selectedContext: state.app.selectedContext,
    errorMessage: state.profileRoot.errorMessage
  };
}

export default connect(mapStateToProps)(ProfileRoot);
