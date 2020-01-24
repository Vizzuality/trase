import reducerRegistry from 'reducer-registry';
import reducer from './static-content.reducer';

reducerRegistry.register('staticContent', reducer);

// not ideal because you have to change in two, but still better than changing across all app
export {
  STATIC_CONTENT__SET_MARKDOWN,
  getStaticContentFilename,
  getStaticContent
} from './static-content.actions';
