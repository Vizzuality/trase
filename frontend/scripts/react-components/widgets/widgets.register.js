import reducerRegistry from 'reducer-registry';
import reducer from './widgets.reducer';
import * as widgetsActions from './widgets.actions';

reducerRegistry.register('widgets', reducer);

export { widgetsActions };
