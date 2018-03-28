import connect from 'connect';
import { updateScroll } from 'redux-first-router';

export default function routeSubscriber(store) {
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
      const filename = routesMap[type].page;
      updateScroll();
      if (this.filename !== filename) {
        this.resetPage();
        this.filename = filename;
        // eslint-disable-next-line space-in-parens
        import(/* webpackChunkName: "[request]" */
        `../pages/${this.filename}.page.jsx`).then(page => {
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
