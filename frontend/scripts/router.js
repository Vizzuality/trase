import { connectRoutes, NOT_FOUND } from 'redux-first-router';
import { parse, stringify } from 'utils/stateURL';

const config = {
  basename: '/',
  querySerializer: {
    parse,
    stringify
  }
};

export const routes = {
  home: {
    path: '/',
    page: 'home'
  },
  tool: {
    path: '/flows',
    page: 'tool'
  },
  profiles: {
    path: '/profiles',
    page: 'profiles'
  },
  profileActor: {
    path: '/profile-actor',
    page: 'profile-actor'
  },
  profilePlace: {
    path: '/profile-place',
    page: 'profile-place'
  },
  data: {
    path: '/data',
    page: 'data'
  },
  about: {
    path: '/about',
    page: 'about'
  },
  termsOfUse: {
    path: '/terms-of-use',
    page: 'terms-of-use'
  },
  dataMethods: {
    path: '/data-methods',
    page: 'data-methods'
  },
  faq: {
    path: '/FAQ',
    page: 'FAQ'
  },
  [NOT_FOUND]: {
    path: '/404'
  }
};

export default connectRoutes(routes, config);