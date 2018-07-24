import { connect } from 'react-redux';
import ProfileNode from 'react-components/profile-node/profile-node.component';

function mapStateToProps(state) {
  const {
    query: { year, nodeId, print } = {},
    payload: { profileType }
  } = state.location;
  return {
    year,
    nodeId,
    profileType,
    printMode: print
  };
}

export default connect(mapStateToProps)(ProfileNode);
