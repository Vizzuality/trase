import reducerRegistry from 'reducer-registry';
import reducer from './home.reducer';

reducerRegistry.register('home', reducer);

// not ideal because you have to change in two, but still better than changing across all app
export {
  HOME__SET_CONTENT,
  HOME__PLAY_VIDEO,
  HOME__CLICK_ENTRYPOINT,
  HOME__CLICK_NEXT_ENTRYPOINT,
  getHomeContent,
  playHomeVideo,
  clickEntrypoint,
  clickNextEntrypoint
} from './home.actions';
