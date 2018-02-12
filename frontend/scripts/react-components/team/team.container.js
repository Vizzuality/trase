import { connect } from 'react-redux';
import Team from './team.component';

function mapStateToProps(state) {
  const { members, groups } = state.team;
  return {
    groups,
    members
  };
}

export default connect(mapStateToProps)(Team);
