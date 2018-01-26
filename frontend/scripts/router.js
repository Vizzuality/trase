import { connectRoutes, NOT_FOUND, replace } from 'redux-first-router';
import connect from 'connect';
import { parse, stringify } from 'utils/stateURL';
import {
  resetToolThunk,
  getPostsContent,
  getTweetsContent,
  getFeaturesContent,
  getPromotedPostContent,
  getTestimonialsContent
} from 'react-components/home/home.thunks';

import {
  getDataPortalContext
} from 'react-components/data-portal/data-portal.thunks';

import {
  getPageStaticContent
} from 'react-components/static-content/static-content.thunks';

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
    thunk: dispatchThunks(
      getPostsContent,
      getTweetsContent,
      getFeaturesContent,
      getPromotedPostContent,
      getTestimonialsContent
    )
  },
  tool: {
    path: '/flows',
    page: 'tool',
    thunk: dispatchThunks(resetToolThunk)
  },
  profiles: {
    path: '/profiles',
    page: 'profiles',
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
  termsOfUse: {
    path: '/terms-of-use',
    page: 'static-content',
    thunk: dispatchThunks(getPageStaticContent)
  },
  dataMethods: {
    path: '/data-methods',
    page: 'static-content',
    thunk: dispatchThunks(getPageStaticContent)
  },
  faq: {
    path: '/FAQ',
    page: 'static-content',
    thunk: dispatchThunks(getPageStaticContent)
  },
  [NOT_FOUND]: {
    path: '/404',
    page: 'static-content',
    thunk: dispatchThunks(
      () => replace('/404'),
      getPageStaticContent
    )
  }
};


export function routeSubscriber(store) {
  class RouterComponent {
    constructor() {
      this.filename = null;
      this.page = null;
      this.root = document.getElementById('app-root-container');
      this.onRouteChange = this.onRouteChange.bind(this);
      this.resetPage = this.resetPage.bind(this);
    }

    onCreated() {
      this.onRouteChange(store.getState().location);
    }

    resetPage() {
      if (this.page && this.page.unmount) this.page.unmount(this.root, store);
    }

    onRouteChange({ routesMap, type } = {}) {
      const filename = routesMap[type];
      if (this.filename !== filename) {
        this.resetPage();
        this.filename = filename;
        // eslint-disable-next-line space-in-parens
        import(
          /* webpackChunkName: "[request]" */
          `./pages/${this.filename.page}.page.jsx`
        )
          .then((page) => {
            this.page = page;
            this.page.mount(this.root, store);
          });
      }
    }
  }

  const mapMethodsToState = () => ({
    onRouteChange: {
      _comparedValue: state => state.location.type,
      _returnedValue: state => state.location
    }
  });
  const RouterContainer = connect(RouterComponent, mapMethodsToState);

  return new RouterContainer(store);
}

export default connectRoutes(routes, config);
