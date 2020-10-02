import reducerRegistry from 'reducer-registry';
import reducer from './logistics-map.reducer';
import * as logisticsMapActions from './logistics-map.actions';

reducerRegistry.register('logisticsMap', reducer);

export { logisticsMapActions };
