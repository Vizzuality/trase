import { connect } from 'react-redux';
import ProfileNode from 'react-components/profile-node/profile-node.component';

function mapStateToProps(state) {
  const {
    query: { year, nodeId, print } = {},
    payload: { profileType }
  } = state.location;
  return {
    profileType,
    contextId: 1,
    printMode: print,
    year: parseInt(year, 10),
    nodeId: parseInt(nodeId, 10)
  };
}

export default connect(mapStateToProps)(ProfileNode);
