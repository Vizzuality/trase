import { teamActions } from 'react-components/team/team.register';

export default function(dispatch) {
  return dispatch(teamActions.getTeamData());
}
