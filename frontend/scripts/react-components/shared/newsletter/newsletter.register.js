import reducerRegistry from 'reducer-registry';
import reducer from './newsletter.reducer';
import * as newsletterActions from './newsletter.actions';

reducerRegistry.register('newsletter', reducer);

export { newsletterActions };
