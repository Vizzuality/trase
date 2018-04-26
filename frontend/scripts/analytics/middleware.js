import isFunction from 'lodash/isFunction';
import GA_TOOL_EVENTS from './tool.events';
import GA_DATA_EVENTS from './data.events';
import GA_ROUTER_EVENTS from './router.events';

const GA_EVENT_WHITELIST = [...GA_TOOL_EVENTS, ...GA_DATA_EVENTS, ...GA_ROUTER_EVENTS];

function createGAEvent(event, action, state) {
  if (event.hitType === 'pageview') {
    return {
      hitType: 'pageview',
      page: window.location.pathname
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
    const event = GA_EVENT_WHITELIST.find(whitelistEvent => action.type === whitelistEvent.type);

    if (event) {
      const gaEvent = createGAEvent(event, action, state);
      window.ga('send', gaEvent);
    }
  }

  return next(action);
};

export default googleAnalyticsMiddleware;
