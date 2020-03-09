import reducerRegistry from 'reducer-registry';
import reducers from './team.reducer';
import * as teamActions from './team.actions';

reducerRegistry.register('team', reducers);

export { teamActions };
