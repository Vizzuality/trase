import { WIDGETS__SET_ENDPOINT_DATA } from 'react-components/widgets/widgets.actions';
import { APP__ON_PDF_DOWNLOAD } from 'app/app.actions';
import { GET_NODE_SUMMARY_URL, GET_COUNTRY_NODE_SUMMARY_URL } from 'utils/getURLFromParams';

export default [
  {
    type: WIDGETS__SET_ENDPOINT_DATA,
    action: 'Profile page visited',
    category: 'profile',
    getPayload(action, state) {
      const { data } = action.payload;
      const {
        location: { query },
        app: { contexts }
      } = state;
      const context = contexts.find(ctx => Number(query.contextId) === ctx.id);

      // eslint-disable-next-line
      return `${data?.jurisdiction_name || data?.node_name} - ${data?.column_name} - ${
        context?.countryName
      } - ${context?.commodityName} - ${query?.year}`;
    },
    shouldSend: action =>
      action.payload.endpoint === GET_NODE_SUMMARY_URL ||
      action.payload.endpoint === GET_COUNTRY_NODE_SUMMARY_URL
  },
  {
    type: APP__ON_PDF_DOWNLOAD,
    action: 'Download PDF',
    category: 'profile',
    getPayload(action, state) {
      return state.location.search;
    }
  }
];
