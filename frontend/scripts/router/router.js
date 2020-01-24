import { lazy } from 'react';
import { connectRoutes, NOT_FOUND, redirect, replace } from 'redux-first-router';
import restoreScroll from 'redux-first-router-restore-scroll';
import parseURL from 'utils/parseURL';
import qs from 'qs';
import { BREAKPOINTS } from 'constants';
import withSidebarNavLayout from 'react-components/nav/sidebar-nav/with-sidebar-nav-layout.hoc';
import getPageTitle from 'scripts/router/page-title';

const getPostsContent = (dispatch, getState) =>
  import('../react-components/home/home.thunks').then(module =>
    module.getPostsContent(dispatch, getState)
  );
const getTestimonialsContent = (dispatch, getState) =>
  import('../react-components/home/home.thunks').then(module =>
    module.getTestimonialsContent(dispatch, getState)
  );
const getTweetsContent = (dispatch, getState) =>
  import('../react-components/home/home.thunks').then(module =>
    module.getTweetsContent(dispatch, getState)
  );
const loadColumnsData = (dispatch, getState) =>
  import('../react-components/profile-node/profile-node.thunks').then(module =>
    module.loadColumnsData(dispatch, getState)
  );
const loadTopNodes = (dispatch, getState) =>
  import('../react-components/profile-root/profile-root.thunks').then(module =>
    module.loadTopNodes(dispatch, getState)
  );
const getPageStaticContent = (dispatch, getState) =>
  import('../react-components/static-content/static-content.thunks').then(module =>
    module.default(dispatch, getState)
  );
const loadBaseAppData = (dispatch, getState) =>
  import('../app/app.thunks').then(module => module.default(dispatch, getState));
const getTeam = (dispatch, getState) =>
  import('../react-components/team/team.thunks').then(module => module.default(dispatch, getState));
const loadDashboardTemplates = (dispatch, getState) =>
  import('../react-components/dashboard-root/dashboard-root.thunks').then(module =>
    module.loadDashboardTemplates(dispatch, getState)
  );
const redirectToExplore = (dispatch, getState) =>
  import('../react-components/legacy-explore/explore.thunks').then(module =>
    module.redirectToExplore(dispatch, getState)
  );
const loadToolInitialData = (dispatch, getState) =>
  import('../react-components/tool/tool.thunks').then(module =>
    module.loadToolInitialData(dispatch, getState)
  );
const resizeSankeyTool = (dispatch, getState) =>
  import('../react-components/tool/tool.thunks').then(module =>
    module.resizeSankeyTool(dispatch, getState)
  );
const loadDisclaimerTool = (dispatch, getState) =>
  import('../react-components/tool/tool.thunks').then(module =>
    module.loadDisclaimerTool(dispatch, getState)
  );
const loadInitialDashboardData = (dispatch, getState) =>
  import('../react-components/dashboard-element/dashboard-element.thunks').then(module =>
    module.loadInitialDashboardData(dispatch, getState)
  );

const pagesSupportedLimit = {
  data: 'small',
  tool: 'tablet',
  map: 'tablet'
};

// We await for all thunks using Promise.all, this makes the result then-able and allows us to
// add an await solely to the thunks that need it.
const dispatchThunks = (...thunks) => (...params) =>
  Promise.all(thunks.map(thunk => thunk(...params)));

const loadPageData = (...thunks) => (...params) =>
  loadBaseAppData(...params).then(() => Promise.all(thunks.map(thunk => thunk(...params))));

const StaticContent = lazy(() =>
  import('../react-components/static-content/static-content.container')
);

export const routes = {
  home: {
    path: '/',
    Component: lazy(() => import('../react-components/home/home.container')),
    title: getPageTitle,
    thunk: loadPageData(getPostsContent, getTweetsContent, getTestimonialsContent)
  },
  explore: {
    path: '/explore',
    Component: lazy(() => import('../react-components/explore/explore.js')),
    title: getPageTitle,
    thunk: loadPageData(),
    nav: {
      className: '-light'
    },
    footer: false
  },
  tool: {
    path: '/flows/:section?',
    Component: lazy(() => import('../react-components/tool/tool.js')),
    title: getPageTitle,
    thunk: loadPageData(loadToolInitialData, resizeSankeyTool, loadDisclaimerTool),
    footer: false,
    nav: {
      className: '-light'
    }
  },
  profileRoot: {
    path: '/profiles',
    Component: lazy(() => import('../react-components/profile-root/profile-root.container')),
    title: getPageTitle,
    extension: 'jsx',
    nav: {
      className: '-light'
    },
    thunk: loadPageData(loadTopNodes)
  },
  profileNode: {
    path: '/profile-:profileType',
    Component: lazy(() => import('../react-components/profile-node/profile-node.container')),
    title: getPageTitle,
    nav: {
      className: '-light',
      printable: true
    },
    thunk: loadPageData(loadColumnsData)
  },
  dashboardRoot: {
    path: '/dashboards',
    Component: lazy(() => import('../react-components/dashboard-root/dashboard-root.container')),
    title: getPageTitle,
    thunk: loadPageData(loadDashboardTemplates)
  },
  dashboardElement: {
    path: '/dashboards/:dashboardId',
    Component: lazy(() =>
      import('../react-components/dashboard-element/dashboard-element.container')
    ),
    title: getPageTitle,
    thunk: loadPageData(loadInitialDashboardData)
  },
  data: {
    path: '/data',
    Component: lazy(() => import('../react-components/data-portal/data-portal.container')),
    title: getPageTitle,
    thunk: loadPageData(),
    nav: {
      className: '-light'
    }
  },
  team: {
    path: '/about/team',
    Component: StaticContent,
    title: getPageTitle,
    thunk: loadPageData(getTeam),
    layout: withSidebarNavLayout
  },
  teamMember: {
    path: '/about/team/:member',
    Component: StaticContent,
    title: getPageTitle,
    thunk: loadPageData(getTeam),
    layout: withSidebarNavLayout,
    parent: 'team'
  },
  about: {
    path: '/about/:section?',
    Component: StaticContent,
    title: getPageTitle,
    thunk: loadPageData(getPageStaticContent),
    layout: withSidebarNavLayout
  },
  notSupportedOnMobile: {
    path: '/not-supported',
    Component: lazy(() => import('../react-components/mobile/not-supported.component')),
    title: getPageTitle,
    nav: {
      className: '-light'
    },
    thunk: loadPageData()
  },
  logisticsMap: {
    path: '/logistics-map',
    Component: lazy(() => import('../react-components/logistics-map/logistics-map.container')),
    thunk: loadPageData(),
    title: getPageTitle,
    footer: false,
    nav: {
      className: '-light'
    }
  },
  [NOT_FOUND]: {
    path: '/404',
    Component: StaticContent,
    title: getPageTitle,
    thunk: loadPageData(() => replace('/404'), getPageStaticContent)
  }
};

const config = {
  basename: '/',
  notFoundPath: '/404',
  initialDispatch: false,
  querySerializer: {
    parse: url => parseURL(url),
    stringify: params => qs.stringify(params, { arrayFormat: 'brackets' })
  },
  title: state => {
    const route = routes[state.location.type];

    if (!route.title) {
      return 'TRASE';
    }

    if (typeof route.title === 'function') {
      return route.title(state);
    }

    return route;
  },
  onBeforeChange: (dispatch, getState, { action }) => {
    const supportedLimit = pagesSupportedLimit[action.type];
    if (supportedLimit && window.innerWidth <= BREAKPOINTS[supportedLimit]) {
      return dispatch(redirect({ type: 'notSupportedOnMobile' }));
    }

    return dispatchThunks(redirectToExplore)(dispatch, getState, { action });
  },
  onAfterChange: (dispatch, getState, { action }) => {
    const currentLanguage = action.meta.location?.current?.query?.lang;
    const previousLanguage = action.meta.location?.prev?.query?.lang;
    const addLanguageToUrl = lang => {
      const { location } = getState();
      const query = { ...location.query, lang };
      const payload = { ...location.payload, query };
      dispatch(redirect({ type: location.type, payload }));
    };

    if (!currentLanguage && previousLanguage) {
      addLanguageToUrl(previousLanguage);
    }
  },
  restoreScroll: restoreScroll({
    shouldUpdateScroll: (prev, current) => {
      if (
        ((current.kind === 'redirect' && prev.kind === 'push') ||
          (current.kind === 'pop' && prev.kind === 'pop')) &&
        prev.pathname === current.pathname
      ) {
        return prev.prev.pathname !== current.pathname ? [0, 0] : false;
      }
      return prev.pathname !== current.pathname ? [0, 0] : false;
    }
  })
};

export default connectRoutes(routes, config);
