import {
  GA_TRACK_DOWNLOAD
} from './analytics.actions';

export default [
  {
    type: GA_TRACK_DOWNLOAD,
    category: 'Download',
    name: 'download',
    action: action => `Download ${action.payload.type} data`,
    getPayload: (action, state) => {
      const context = state.app.contexts.find(
        elem => elem.id === parseInt(action.payload.context_id, 10)
      );
      const payload = Object.assign(
        {},
        {
          country: context?.countryName,
          commodity: context?.commodityName
        },
        action.payload
      );
      if (payload.c_ids) {
        payload.consumptionCountries = payload.c_ids.map(
          countryId =>
            state.data.consumptionCountries.find(elem => elem.id === parseInt(countryId, 10)).name
        );
      }
      if (payload.e_ids) {
        payload.exporters = payload.e_ids.map(
          exportersId =>
            state.data.exporters.find(elem => elem.id === parseInt(exportersId, 10)).name
        );
      }
      // TODO: apply filters values?
      if (payload.filters) {
        payload.filters = payload.filters.map(
          filter => state.data.indicators.find(elem => elem.name === filter.name).frontendName
        );
      }

      delete payload.c_ids;
      delete payload.e_ids;
      delete payload.context_id;
      delete payload.table;
      delete payload.separator;

      const payloadStringComponents = [];

      Object.keys(payload).forEach(key => {
        const value = payload[key];
        if (value && value instanceof Array && value.length) {
          payloadStringComponents.push(`${key}=${value.join(',')}`);
        } else {
          payloadStringComponents.push(`${key}=${value}`);
        }
      });

      return payloadStringComponents.join(';');
    }
  }
];
