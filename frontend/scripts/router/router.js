import { connectRoutes, NOT_FOUND, redirect, replace } from 'redux-first-router';
import restoreScroll from 'redux-first-router-restore-scroll';
import parseURL from 'utils/parseURL';
import qs from 'qs';

import { BREAKPOINTS } from 'constants';
import {
  getPostsContent,
  getTestimonialsContent,
  getTweetsContent
} from 'react-components/home/home.thunks';
import { loadTopNodes } from 'react-components/profile-root/profile-root.thunks';
import { loadColumnsData } from 'react-components/profile-node/profile-node.thunks';
import withSidebarNavLayout from 'react-components/nav/sidebar-nav/with-sidebar-nav-layout.hoc';
import getPageStaticContent from 'react-components/static-content/static-content.thunks';
import loadBaseAppData from 'reducers/app.thunks';
import getTeam from 'react-components/team/team.thunks';
import { loadDashboardTemplates } from 'react-components/dashboard-root/dashboard-root.thunks';
import { redirectToExplore } from 'react-components/legacy-explore/explore.thunks';
import {
  loadToolInitialData,
  resizeSankeyTool,
  loadDisclaimerTool
} from 'scripts/react-components/tool/tool.thunks';
import { loadInitialDashboardData } from 'scripts/react-components/dashboard-element/dashboard-element.thunks';

import getPageTitle from 'scripts/router/page-title';

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

export const routes = {
  home: {
    path: '/',
    page: 'home',
    title: getPageTitle,
    thunk: loadPageData(getPostsContent, getTweetsContent, getTestimonialsContent)
  },
  explore: {
    path: '/explore',
    page: 'explore',
    title: getPageTitle,
    thunk: loadPageData(),
    nav: {
      className: '-light',
      links: []
    }
  },
  tool: {
    path: '/flows/:section?',
    page: 'tool',
    title: getPageTitle,
    thunk: loadPageData(loadToolInitialData, resizeSankeyTool, loadDisclaimerTool)
  },
  profileRoot: {
    path: '/profiles',
    page: 'profile-root',
    title: getPageTitle,
    extension: 'jsx',
    nav: {
      className: '-light'
    },
    thunk: loadPageData(loadTopNodes)
  },
  profileNode: {
    path: '/profile-:profileType',
    page: 'profile-node',
    title: getPageTitle,
    nav: {
      className: '-light',
      printable: true
    },
    thunk: loadPageData(loadColumnsData)
  },
  dashboardRoot: {
    path: '/dashboards',
    page: 'dashboard-root',
    title: getPageTitle,
    thunk: loadPageData(loadDashboardTemplates)
  },
  dashboardElement: {
    path: '/dashboards/:dashboardId',
    page: 'dashboard-element',
    title: getPageTitle,
    thunk: loadPageData(loadInitialDashboardData)
  },
  data: {
    path: '/data',
    page: 'data-portal',
    title: getPageTitle,
    thunk: loadPageData(),
    nav: {
      className: '-light'
    }
  },
  team: {
    path: '/about/team',
    page: 'static-content',
    title: getPageTitle,
    thunk: loadPageData(getTeam),
    layout: withSidebarNavLayout
  },
  teamMember: {
    path: '/about/team/:member',
    page: 'static-content',
    title: getPageTitle,
    thunk: loadPageData(getTeam),
    layout: withSidebarNavLayout,
    parent: 'team'
  },
  about: {
    path: '/about/:section?',
    page: 'static-content',
    title: getPageTitle,
    thunk: loadPageData(getPageStaticContent),
    layout: withSidebarNavLayout
  },
  notSupportedOnMobile: {
    path: '/not-supported',
    page: 'not-supported',
    title: getPageTitle,
    nav: {
      className: '-light'
    },
    thunk: loadPageData()
  },
  logisticsMap: {
    path: '/logistics-map',
    page: 'logistics-map',
    thunk: loadPageData(),
    title: getPageTitle
  },
  [NOT_FOUND]: {
    path: '/404',
    page: 'static-content',
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
