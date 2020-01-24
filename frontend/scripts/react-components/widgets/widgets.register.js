import reducerRegistry from 'reducer-registry';
import reducer from './widgets.reducer';

reducerRegistry.register('widgets', reducer);

// not ideal because you have to change in two, but still better than changing across all app
export {
  WIDGETS__INIT_ENDPOINT,
  WIDGETS__SET_ENDPOINT_DATA,
  WIDGETS__SET_ENDPOINT_ERROR,
  prepareWidget,
  getWidgetState,
  getWidgetData
} from './widgets.actions';
