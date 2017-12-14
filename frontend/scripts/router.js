import { connectRoutes, NOT_FOUND } from 'redux-first-router';
import connect from 'connect';
import { parse, stringify } from 'utils/stateURL';
import actions from 'actions';

const config = {
  basename: '/',
  querySerializer: {
    parse,
    stringify
  }
};
const resetTool = (dispatch, getState) => {
  const { state, isMapVisible } = getState().location.query || {};
  if (!state) {
    dispatch({ type: actions.RESET_TOOL_STATE, payload: { isMapVisible } });
  }
};
const routes = {
  home: {
    path: '/',
    page: 'home'
  },
  tool: {
    path: '/flows',
    page: 'tool',
    thunk: resetTool
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
      if (this.page && this.page.unmount) this.page.unmount();
      this.root.innerHTML = '';
    }

    onRouteChange({ routesMap, type } = {}) {
      if (this.type !== type) {
        this.resetPage();
        this.type = type;
        import(/* webpackChunkName: "page" */ `./pages/${routesMap[this.type].page}.page.js`)
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
  const RouterContainer =  connect(RouterComponent, mapMethodsToState);

  return new RouterContainer(store);
}

export default connectRoutes(routes, config);