import {
  getStaticContent,
  getTeamData
} from 'react-components/static-content/static-content.actions';

export const getPageStaticContent = dispatch => dispatch(getStaticContent());

export const getTeam = dispatch => dispatch(getTeamData(true));
