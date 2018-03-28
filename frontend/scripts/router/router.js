import { connectRoutes, NOT_FOUND, redirect, replace } from 'redux-first-router';
import restoreScroll from 'redux-first-router-restore-scroll'

import MarkdownRenderer from 'react-components/static-content/markdown-renderer/markdown-renderer.container';
import TeamMember from 'react-components/team/team-member/team-member.container';
import Team from 'react-components/team/team.container';
import { parse, stringify } from 'utils/stateURL';

import { BREAKPOINTS } from 'constants';
import { getDataPortalContext } from 'react-components/data-portal/data-portal.thunks';
import {
  getPostsContent,
  getTestimonialsContent,
  getTweetsContent,
  resetToolThunk,
  loadInitialDataHome
} from 'react-components/home/home.thunks';
import { withSidebarNavLayout } from 'react-components/nav/sidebar-nav/with-sidebar-nav-layout.hoc';
import { getProfileRootNodes } from 'react-components/profile-root/profile-root.thunks';
import { getPageStaticContent } from 'react-components/static-content/static-content.thunks';
import { getTeam } from 'react-components/team/team.thunks';
import { loadInitialDataExplore, redirectToExplore } from 'react-components/explore/explore.thunks';

const pagesNotSupportedOnMobile = ['tool', 'map', 'data'];

// We await for all thunks using Promise.all, this makes the result then-able and allows us to
// add an await solely to the thunks that need it.
const dispatchThunks = (...thunks) => (...params) =>
  Promise.all(thunks.map(thunk => thunk(...params)));

const config = {
  basename: '/',
  notFoundPath: '/404',
  querySerializer: {
    parse,
    stringify
  },
  onBeforeChange: (dispatch, getState, { action }) => {
    const isMobile = window.innerWidth <= BREAKPOINTS.small;

    if (isMobile && pagesNotSupportedOnMobile.includes(action.type)) {
      return dispatch(redirect({ type: 'notSupportedOnMobile' }));
    }

    return dispatchThunks(redirectToExplore, resetToolThunk)(dispatch, getState, { action });
  },
  restoreScroll: restoreScroll({
    shouldUpdateScroll: (prev, current) => {
      const currentQuery = current.payload.query;
      if (
        currentQuery &&
        prev.query &&
        prev.query.lang !== currentQuery.lang &&
        prev.pathname === current.pathname
      ) {
        return prev.prev.pathname !== current.pathname ? [0, 0] : false;
      }
      return prev.pathname !== current.pathname ? [0, 0] : false;
    }
  })
};

const routes = {
  home: {
    path: '/',
    page: 'home',
    thunk: dispatchThunks(
      getPostsContent,
      getTweetsContent,
      getTestimonialsContent,
      loadInitialDataHome
    )
  },
  explore: {
    path: '/explore/:contextId?',
    page: 'explore',
    thunk: dispatchThunks(loadInitialDataExplore)
  },
  tool: {
    path: '/flows',
    page: 'tool'
  },
  profileRoot: {
    path: '/profiles',
    page: 'profile-root',
    extension: 'jsx',
    thunk: dispatchThunks(getProfileRootNodes),
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
  team: {
    path: '/about/team',
    page: 'static-content',
    thunk: dispatchThunks(getTeam),
    component: withSidebarNavLayout(Team)
  },
  teamMember: {
    path: '/about/team/:member',
    page: 'static-content',
    thunk: dispatchThunks(getTeam),
    component: withSidebarNavLayout(TeamMember)
  },
  about: {
    path: '/about/:section?',
    page: 'static-content',
    thunk: dispatchThunks(getPageStaticContent),
    component: withSidebarNavLayout(MarkdownRenderer)
  },
  notSupportedOnMobile: {
    path: '/not-supported',
    page: 'not-supported',
    nav: {
      className: '-light'
    }
  },
  [NOT_FOUND]: {
    path: '/404',
    page: 'static-content',
    thunk: dispatchThunks(() => replace('/404'), getPageStaticContent)
  }
};

export default connectRoutes(routes, config);
