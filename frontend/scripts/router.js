import { connectRoutes, NOT_FOUND } from 'redux-first-router';
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

const dispatchThunks = (...thunks) => (...params) => thunks.forEach(thunk => thunk(...params));

const config = {
  basename: '/',
  querySerializer: {
    parse,
    stringify
  }
};

const routes = {
  home: {
    path: '/',
    page: 'home',
    extension: 'jsx',
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
    extension: 'jsx',
    thunk: dispatchThunks(resetToolThunk)
  },
  profiles: {
    path: '/profiles',
    page: 'profiles',
    extension: 'jsx'
  },
  profileActor: {
    path: '/profile-actor',
    page: 'profile-actor',
    extension: 'jsx'
  },
  profilePlace: {
    path: '/profile-place',
    page: 'profile-place',
    extension: 'jsx'
  },
  data: {
    path: '/data',
    page: 'data-portal',
    extension: 'jsx',
    thunk: dispatchThunks(getDataPortalContext)
  },
  about: {
    path: '/about/:section?',
    page: 'about',
    extension: 'jsx'
  },
  termsOfUse: {
    path: '/terms-of-use',
    page: 'terms-of-use',
    extension: 'jsx'
  },
  dataMethods: {
    path: '/data-methods',
    page: 'data-methods',
    extension: 'jsx'
  },
  faq: {
    path: '/FAQ',
    page: 'FAQ',
    extension: 'jsx'
  },
  [NOT_FOUND]: {
    path: '/404'
  }
};


export function routeSubscriber(store) {
  class RouterComponent {
    constructor() {
      this.type = null;
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
      if (this.type !== type) {
        this.resetPage();
        this.type = type;
        // eslint-disable-next-line space-in-parens
        import(
          /* webpackChunkName: "[request]" */
          `./pages/${routesMap[this.type].page}.page.${routesMap[this.type].extension}`
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
