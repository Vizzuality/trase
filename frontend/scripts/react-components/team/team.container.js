import { connect } from 'react-redux';
import groupBy from 'lodash/groupBy';
import Team from './team.component';

function mapStateToProps(state) {
  const { staticContent } = state;
  const team = staticContent.team ? Object.values(staticContent.team) : [];
  const groups = Object.values(groupBy(team, 'staffGroup.name'));
  return {
    groups
  };
}

export default connect(mapStateToProps)(Team);
