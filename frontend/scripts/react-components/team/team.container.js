import { connect } from 'react-redux';
import Team from './team.component';

function mapStateToProps(state) {
  const { members, groups, errorMessage } = state.team;
  return {
    groups,
    members,
    errorMessage
  };
}

export default connect(mapStateToProps)(Team);
