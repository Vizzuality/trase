import { getURLFromParams, GET_ALL_NODES_URL, GET_INDICATORS_URL } from 'utils/getURLFromParams';
import axios from 'axios';

export const LOAD_EXPORTERS = 'LOAD_EXPORTERS';
export const LOAD_CONSUMPTION_COUNTRIES = 'LOAD_CONSUMPTION_COUNTRIES';
export const LOAD_INDICATORS = 'LOAD_INDICATORS';

export function loadContextNodes(contextId) {
  return dispatch => {
    const allNodesURL = getURLFromParams(GET_ALL_NODES_URL, { context_id: contextId });
    const indicatorsURL = getURLFromParams(GET_INDICATORS_URL, { context_id: contextId });

    Promise.all(
      [allNodesURL, indicatorsURL].map(url => axios.get(url).then(resp => resp.data))
    ).then(rawPayload => {
      const payload = {
        nodes: rawPayload[0].data,
        indicators: rawPayload[1].indicators
      };

      const flowNodes = payload.nodes.filter(node => node.hasFlows === true);
      const exporters = flowNodes.filter(node => node.type === 'EXPORTER');
      const consumptionCountries = flowNodes.filter(node => node.type === 'COUNTRY');
      const { indicators } = payload;

      dispatch({
        type: LOAD_EXPORTERS,
        exporters
      });

      dispatch({
        type: LOAD_CONSUMPTION_COUNTRIES,
        consumptionCountries
      });

      dispatch({
        type: LOAD_INDICATORS,
        indicators
      });
    });
  };
}
