import isFunction from 'lodash/isFunction';
import GA_TOOL_EVENTS from './tool.events';
import GA_DATA_EVENTS from './data.events';

const GA_EVENT_WHITELIST = [...GA_TOOL_EVENTS, ...GA_DATA_EVENTS];

const googleAnalyticsMiddleware = store => next => action => {
  if (typeof ga !== 'undefined') {
    const state = store.getState();
    const gaAction = GA_EVENT_WHITELIST.find(
      whitelistAction => action.type === whitelistAction.type
    );
    if (gaAction) {
      const gaEvent = {
        hitType: 'event',
        eventCategory: gaAction.category
      };
      if (isFunction(gaAction.action)) {
        gaEvent.eventAction = gaAction.action(action, state);
      } else {
        gaEvent.eventAction = gaAction.action;
      }
      if (gaAction.getPayload) {
        gaEvent.eventLabel = gaAction.getPayload(action, state);
      }
      window.ga('send', gaEvent);
    }
  }

  return next(action);
};

export default googleAnalyticsMiddleware;
