import { connect } from 'react-redux';
import TeamMember from './team-member.component';

function mapStateToProps(state) {
  const { staticContent, location } = state;
  const member = location.payload.member;
  return {
    member: staticContent.team[member]
  };
}

export default connect(mapStateToProps)(TeamMember);
