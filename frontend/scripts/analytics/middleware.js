import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import GA_TOOL_EVENTS from './tool.events';
import GA_DATA_EVENTS from './data-portal.events';
import GA_ROUTER_EVENTS from './router.events';
import GA_HOME_EVENTS from './home.events';
import GA_LEGACY_EXPLORE_EVENTS from './legacy-explore.events';
import GA_EXPLORE_EVENTS from './explore.events';
import GA_PROFILE_NODE_EVENTS from './profile-node.events';
import GA_DASHBOARD_ELEMENT_EVENTS from './dashboard-element.events';

const GA_EVENT_WHITELIST = [
  ...GA_TOOL_EVENTS,
  ...GA_DATA_EVENTS,
  ...GA_ROUTER_EVENTS,
  ...GA_HOME_EVENTS,
  ...GA_LEGACY_EXPLORE_EVENTS,
  ...GA_EXPLORE_EVENTS,
  ...GA_PROFILE_NODE_EVENTS,
  ...GA_DASHBOARD_ELEMENT_EVENTS
].reduce((acc, next) => ({ ...acc, [next.type]: next }), {});
const TRACK_WITH_QUERY = ['profileNode'];

function createGAEvent(event, action, state) {
  if (event.shouldSend && event.shouldSend(action, state) === false) {
    return null;
  }

  if (event.hitType === 'pageview') {
    let prevPath = get(action, 'meta.location.prev.pathname');
    let currPath = get(action, 'meta.location.current.pathname');

    if (TRACK_WITH_QUERY.includes(action.type)) {
      prevPath += `?${get(action, 'meta.location.prev.search')}`;
      currPath += `?${get(action, 'meta.location.current.search')}`;
    }

    // do not track redirects to the same page
    if (prevPath === currPath) return null;

    return {
      hitType: 'pageview',
      page: currPath
    };
  }

  return {
    hitType: 'event',
    eventCategory: event.category,
    eventAction: isFunction(event.action) ? event.action(action, state) : event.action,
    eventLabel: event.getPayload ? event.getPayload(action, state) : undefined
  };
}

const googleAnalyticsMiddleware = store => next => action => {
  if (typeof window.ga !== 'undefined') {
    const state = store.getState();
    const event = GA_EVENT_WHITELIST[action.type];
    if (event) {
      const gaEvent = createGAEvent(event, action, state);
      if (gaEvent) {
        window.ga('send', gaEvent);
      }
    }
  }

  return next(action);
};

export default googleAnalyticsMiddleware;
