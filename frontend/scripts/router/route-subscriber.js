/* eslint-disable no-shadow */
import connect from 'base/connect';

export default function routeSubscriber(store) {
  class RouterComponent {
    constructor() {
      this.filename = null;
      this.page = null;
      this.root = document.getElementById('app-root-container');
      this.onRouteChange = this.onRouteChange.bind(this);
      this.resetPage = this.resetPage.bind(this);
    }

    loadDynamicLayouts(type, layout) {
      // This avoids loading the components from the start, by importing such
      // components at router.js code-splitting purpose was defeated
      switch (type) {
        case 'team':
          return import(`../react-components/team/team.container`);
        case 'teamMember':
          return import(`../react-components/team/team-member/team-member.container`);
        case 'about':
          return import(
            `../react-components/static-content/markdown-renderer/markdown-renderer.container`
          );
        default: {
          const error = new Error(
            `You're trying to load a layout (${layout}) of a page (${type}) that doesnt support it`
          );
          return Promise.reject(error);
        }
      }
    }

    onCreated() {
      this.onRouteChange(store.getState().location);
    }

    resetPage() {
      if (this.page && this.page.unmount) {
        this.page.unmount(this.root, store);
        this.page = null;
      }
    }

    onRouteChange({ routesMap, type } = {}) {
      const { page: filename, layout } = routesMap[type];
      if (this.filename !== filename) {
        this.resetPage();
        this.filename = filename;
        // eslint-disable-next-line space-in-parens
        const loadPagePromise = import(
          /* webpackChunkName: "[request]" */
          `../pages/${this.filename}.page.jsx`
        );

        Promise.all([this.filename, loadPagePromise]).then(([name, page]) => {
          if (name !== this.filename) {
            // a new page has started loading, do nothing
            return;
          }
          if (typeof layout !== 'undefined') {
            this.loadDynamicLayouts(type, layout)
              .then(component => {
                page.mount(this.root, store, { component: layout(component.default) });
                this.page = page;
              })
              .catch(err => {
                console.error(err);
                page.mount(this.root, store);
                this.page = page;
              });
          } else {
            page.mount(this.root, store);
            this.page = page;
          }
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
