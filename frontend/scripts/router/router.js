import { connectRoutes, NOT_FOUND, redirect, replace } from 'redux-first-router';
import restoreScroll from 'redux-first-router-restore-scroll';
import MarkdownRenderer from 'react-components/static-content/markdown-renderer/markdown-renderer.container';
import TeamMember from 'react-components/team/team-member/team-member.container';
import Team from 'react-components/team/team.container';
import { parse, stringify } from 'utils/stateURL';

import { BREAKPOINTS } from 'constants';
import {
  getPostsContent,
  getTestimonialsContent,
  getTweetsContent
} from 'react-components/home/home.thunks';
import withSidebarNavLayout from 'react-components/nav/sidebar-nav/with-sidebar-nav-layout.hoc';
import getPageStaticContent from 'react-components/static-content/static-content.thunks';
import loadBaseAppData from 'react-components/shared/app.thunks';
import getTeam from 'react-components/team/team.thunks';
import {
  setContextForExplorePage,
  redirectToExplore
} from 'react-components/explore/explore.thunks';
import { loadToolInitialData } from 'scripts/react-components/tool/tool.thunks';
import getPageTitle from 'scripts/router/page-title';

const pagesNotSupportedOnMobile = ['tool', 'map', 'data'];

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
    path: '/explore/:contextId?',
    page: 'explore',
    title: getPageTitle,
    thunk: loadPageData(setContextForExplorePage)
  },
  tool: {
    path: '/flows',
    page: 'tool',
    title: getPageTitle,
    thunk: loadPageData(loadToolInitialData)
  },
  profileRoot: {
    path: '/profiles',
    page: 'profile-root',
    title: getPageTitle,
    extension: 'jsx',
    nav: {
      className: '-light'
    },
    thunk: loadPageData()
  },
  profileNode: {
    path: '/profile-:profileType',
    page: 'profile-node',
    title: getPageTitle,
    nav: {
      className: '-light',
      printable: true
    },
    thunk: loadPageData()
  },
  dashboardRoot: {
    path: '/dashboards',
    page: 'dashboard-root',
    title: getPageTitle,
    thunk: loadPageData(getPostsContent)
  },
  dashboardElement: {
    path: '/dashboards/:dashboardId',
    page: 'dashboard-element',
    title: getPageTitle,
    thunk: loadPageData(getPostsContent)
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
    component: withSidebarNavLayout(Team)
  },
  teamMember: {
    path: '/about/team/:member',
    page: 'static-content',
    title: getPageTitle,
    thunk: loadPageData(getTeam),
    component: withSidebarNavLayout(TeamMember),
    parent: 'team'
  },
  about: {
    path: '/about/:section?',
    page: 'static-content',
    title: getPageTitle,
    thunk: loadPageData(getPageStaticContent),
    component: withSidebarNavLayout(MarkdownRenderer)
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
  querySerializer: {
    parse,
    stringify
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
    const isMobile = window.innerWidth <= BREAKPOINTS.small;

    if (isMobile && pagesNotSupportedOnMobile.includes(action.type)) {
      return dispatch(redirect({ type: 'notSupportedOnMobile' }));
    }

    return dispatchThunks(redirectToExplore)(dispatch, getState, { action });
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
