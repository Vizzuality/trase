import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProfileNode from 'react-components/profile-node/profile-node.component';

function mapStateToProps(state) {
  const {
    query: { year, nodeId, print, contextId = 1 } = {},
    payload: { profileType }
  } = state.location;
  const { tooltips, contexts } = state.app;
  const ctxId = contextId && parseInt(contextId, 10);
  const context = contexts.find(ctx => ctx.id === ctxId) || { id: ctxId };
  return {
    tooltips,
    context,
    profileType,
    printMode: print && JSON.parse(print),
    year: parseInt(year, 10),
    nodeId: parseInt(nodeId, 10)
  };
}

const updateQueryParams = (profileType, query) => ({
  type: 'profileNode',
  payload: { query, profileType }
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateQueryParams
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileNode);
