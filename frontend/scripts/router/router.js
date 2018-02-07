import { connectRoutes, NOT_FOUND, replace } from 'redux-first-router';
import { parse, stringify } from 'utils/stateURL';
import {
  resetToolThunk,
  getPostsContent,
  getTweetsContent,
  getTestimonialsContent
} from 'react-components/home/home.thunks';

import { getDataPortalContext } from 'react-components/data-portal/data-portal.thunks';

import { getPageStaticContent } from 'react-components/static-content/static-content.thunks';
import { getProfileRootNodes } from 'react-components/profile-root/profile-root.thunks';

const dispatchThunks = (...thunks) => (...params) => thunks.forEach(thunk => thunk(...params));

const config = {
  basename: '/',
  querySerializer: {
    parse,
    stringify
  },
  notFoundPath: '/404'
};

const routes = {
  home: {
    path: '/',
    page: 'home',
    thunk: dispatchThunks(getPostsContent, getTweetsContent, getTestimonialsContent)
  },
  tool: {
    path: '/flows',
    page: 'tool',
    thunk: dispatchThunks(resetToolThunk)
  },
  profileRoot: {
    path: '/profiles',
    page: 'profile-root',
    extension: 'jsx',
    thunk: dispatchThunks(getProfileRootNodes),
    nav: {
      className: '-light'
    }
  },
  profileActor: {
    path: '/profile-actor',
    page: 'profile-actor',
    nav: {
      className: '-light',
      printable: true
    }
  },
  profilePlace: {
    path: '/profile-place',
    page: 'profile-place',
    nav: {
      className: '-light',
      printable: true
    }
  },
  data: {
    path: '/data',
    page: 'data-portal',
    thunk: dispatchThunks(getDataPortalContext),
    nav: {
      className: '-light'
    }
  },
  about: {
    path: '/about/:section?',
    page: 'static-content',
    thunk: dispatchThunks(getPageStaticContent)
  },
  [NOT_FOUND]: {
    path: '/404',
    page: 'static-content',
    thunk: dispatchThunks(() => replace('/404'), getPageStaticContent)
  }
};

export default connectRoutes(routes, config);
