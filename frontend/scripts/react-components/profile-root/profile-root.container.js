import { connect } from 'react-redux';
import ProfileRoot from 'react-components/profile-root/profile-root.component';
import {
  getContextsWithProfilePages,
  getParsedTopProfiles
} from 'react-components/profile-root/profile-root.selectors';
import { getSelectedContext } from 'app/app.selectors';
import { openModal } from 'react-components/shared/profile-selector/profile-selector.actions';

function mapStateToProps(state) {
  const selectedContext = getSelectedContext(state);
  const selectorContexts = getContextsWithProfilePages(state);

  // we make sure the globally selected context is available in the selectorContexts
  const activeContext = selectedContext
    ? selectorContexts.find(ctx => ctx.id === selectedContext.id)
    : null;

  return {
    activeContext,
    selectContexts: contexts => contexts.filter(ctx => ctx.hasProfiles),
    errorMessage: state.profileRoot.errorMessage,
    topProfiles: getParsedTopProfiles(state),
    contexts: state.app.contexts
  };
}

const mapDispatchToProps = {
  openModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileRoot);
