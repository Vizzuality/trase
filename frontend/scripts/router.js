import { connectRoutes, NOT_FOUND } from 'redux-first-router';

// thunks

// pages


export const routes = {
  home: {
    path: '/',
  },
  [NOT_FOUND]: {
    path: '/404'
  }
};

export default connectRoutes(routes, { basename: '/' });