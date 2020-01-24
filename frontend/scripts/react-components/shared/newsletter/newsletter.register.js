import reducerRegistry from 'reducer-registry';
import reducer from './newsletter.reducer';

reducerRegistry.register('newsletter', reducer);

// not ideal because you have to change in two, but still better than changing across all app
export {
  NEWSLETTER__SET_SUBSCRIPTION_MESSAGE,
  NEWSLETTER__RESET_NEWSLETTER,
  sendSubscriptionEmail,
  resetNewsletter
} from './newsletter.actions';
