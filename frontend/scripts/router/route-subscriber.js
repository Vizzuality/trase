/* eslint-disable no-shadow */
import connect from 'connect';

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

    onProfilePageChange(location) {
      // Fix global search on profile pages, to remount the same profile page with different nodeId
      // TODO: eventually we may remove that when we refactor old style pages to be react components
      if (
        location &&
        location.type === 'profileNode' &&
        location.type === location.prev.type &&
        parseInt(location.query.nodeId, 10) !== parseInt(location.prev.query.nodeId, 10)
      ) {
        this.filename = null;
        this.onRouteChange(location);
      }
    }
  }

  const mapMethodsToState = state => ({
    onRouteChange: {
      _comparedValue: state => state.location.type,
      _returnedValue: state => state.location
    },
    onProfilePageChange: state.location
  });
  const RouterContainer = connect(
    RouterComponent,
    mapMethodsToState
  );

  return new RouterContainer(store);
}
