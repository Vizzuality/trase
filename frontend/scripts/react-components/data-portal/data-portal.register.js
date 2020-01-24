import reducerRegistry from 'reducer-registry';
import reducer from './data-portal.reducer';

reducerRegistry.register('data', reducer);

// not ideal because you have to change in two, but still better than changing across all app
export {
  LOAD_EXPORTERS,
  LOAD_CONSUMPTION_COUNTRIES,
  LOAD_INDICATORS,
  loadContextNodes
} from './data-portal.actions';
