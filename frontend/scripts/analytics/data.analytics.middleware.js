import isFunction from 'lodash/isFunction';
import {
  GA_TRACK_DOWNLOAD_FILE_TYPE,
  GA_TRACK_DOWNLOAD_FILTERS,
  GA_TRACK_DOWNLOAD_FORM_LOADED,
  GA_TRACK_DOWNLOAD_OUTPUT_TYPE
} from './analytics.actions';

export const GA_ACTION_WHITELIST = [
  {
    type: GA_TRACK_DOWNLOAD_FILTERS,
    category: 'Download',
    action: action => `Download ${action.payload.type} data`,
    getPayload: (action, state) => {
      const context = state.data.contexts.find(
        elem => elem.id === parseInt(action.payload.context_id, 10)
      );
      const payload = Object.assign(
        {},
        {
          country: context.countryName,
          commodity: context.commodityName
        },
        action.payload
      );
      if (payload.countries_ids) {
        payload.consumptionCountries = payload.countries_ids.map(
          countryId =>
            state.data.consumptionCountries.find(elem => elem.id === parseInt(countryId, 10)).name
        );
      }
      if (payload.exporters_ids) {
        payload.exporters = payload.exporters_ids.map(
          exportersId =>
            state.data.exporters.find(elem => elem.id === parseInt(exportersId, 10)).name
        );
      }
      if (payload.indicators) {
        payload.indicators = payload.indicators.map(
          indicatorName =>
            state.data.indicators.find(elem => elem.name === indicatorName).frontendName
        );
      }

      delete payload.countries_ids;
      delete payload.exporters_ids;
      delete payload.indicators;
      delete payload.context_id;
      delete payload.file;
      delete payload.type;
      delete payload.table;
      delete payload.separator;

      const payloadStringComponents = [];

      Object.keys(payload).forEach(key => {
        if (Array.isArray(payload[key])) {
          payloadStringComponents.push(`${key}=${payload[key].join(',')}`);
        } else {
          payloadStringComponents.push(`${key}=${payload[key]}`);
        }
      });

      return payloadStringComponents.join(';');
    }
  },
  {
    type: GA_TRACK_DOWNLOAD_FORM_LOADED,
    category: 'Download',
    action: 'Download form loaded',
    getPayload: action => action.payload
  },
  {
    type: GA_TRACK_DOWNLOAD_OUTPUT_TYPE,
    category: 'Download',
    action: 'Download Output Type',
    getPayload: action => action.payload
  },
  {
    type: GA_TRACK_DOWNLOAD_FILE_TYPE,
    category: 'Download',
    action: 'Download File Type',
    getPayload: action => action.payload
  }
];

const googleAnalyticsMiddleware = store => next => action => {
  if (typeof ga !== 'undefined') {
    const state = store.getState();
    const gaAction = GA_ACTION_WHITELIST.find(
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

export { googleAnalyticsMiddleware as default };
