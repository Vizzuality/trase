import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProfileNode from 'react-components/profile-node/profile-node.component';

function mapStateToProps(state) {
  const {
    query: { year, nodeId, print } = {},
    payload: { profileType }
  } = state.location;
  const { tooltips } = state.app;
  return {
    tooltips,
    profileType,
    contextId: 1,
    printMode: print && JSON.parse(print),
    year: parseInt(year, 10),
    nodeId: parseInt(nodeId, 10)
  };
}

const updateQueryParams = (query, profileType) => ({
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
