import { connect } from 'react-redux';
import TeamMember from './team-member.component';

function mapStateToProps(state) {
  const { team, location } = state;
  const member = location.payload.member;
  return {
    member: team.members && team.members[member],
    errorMessage: team.errorMessage
  };
}

export default connect(mapStateToProps)(TeamMember);
