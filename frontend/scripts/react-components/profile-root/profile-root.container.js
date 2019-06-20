import { connect } from 'react-redux';
import ProfileRoot from 'react-components/profile-root/profile-root.component';
import { getContextsWithProfilePages } from 'react-components/profile-root/profile-root.selectors';

function mapStateToProps(state) {
  const { contexts, selectedContext } = state.app;
  const selectorContexts = getContextsWithProfilePages(contexts);

  // we make sure the globally selected context is available in the selectorContexts
  const activeContext = selectedContext
    ? selectorContexts.find(ctx => {
        if (DISABLE_MULTIPLE_CONTEXT_PROFILES) {
          return ctx.countryName === 'BRAZIL' && ctx.commodityName === 'SOY';
        }
        return ctx.id === selectedContext.id;
      })
    : null;

  const cardsInfo = [{}, {}, {}, {}]; // Just mocking
  return {
    activeContext,
    getContextsWithProfilePages,
    errorMessage: state.profileRoot.errorMessage,
    cardsInfo,
    contexts
  };
}

export default connect(mapStateToProps)(ProfileRoot);
