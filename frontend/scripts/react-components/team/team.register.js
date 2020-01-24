import reducerRegistry from 'reducer-registry';
import reducers from './team.reducer';

reducerRegistry.register('team', reducers);

// not ideal because you have to change in two, but still better than changing across all app
export {
  TEAM__SET_CONTENT,
  TEAM__SET_ERROR_MESSAGE,
  getStaticContentFilename,
  getTeamData
} from './team.actions';
