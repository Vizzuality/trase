import actions from 'actions';
import {
  getURLFromParams, GET_CONTEXTS, GET_ALL_NODES,
  GET_INDICATORS
} from 'utils/getURLFromParams';

export function loadContext() {
  return (dispatch) => {
    const sortContexts = (a, b) => {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    };

    const contextURL = getURLFromParams(GET_CONTEXTS);

    fetch(contextURL).then(resp => resp.text()).then((data) => {
      const payload = JSON.parse(data).data.sort(sortContexts);

      dispatch({
        type: actions.LOAD_CONTEXTS, payload
      });
    });
  };
}

export function loadContextNodes(contextId) {
  return (dispatch) => {
    const allNodesURL = getURLFromParams(GET_ALL_NODES, { context_id: contextId });
    const indicatorsURL = getURLFromParams(GET_INDICATORS, { context_id: contextId });

    Promise
      .all([allNodesURL, indicatorsURL].map(url => fetch(url).then(resp => resp.text())))
      .then((rawPayload) => {
        const payload = {
          nodes: JSON.parse(rawPayload[0]).data,
          indicators: JSON.parse(rawPayload[1]).indicators
        };

        const flowNodes = payload.nodes.filter(node => node.hasFlows === true);
        const exporters = flowNodes.filter(node => node.type === 'EXPORTER');
        const consumptionCountries = flowNodes.filter(node => node.type === 'COUNTRY');
        const indicators = payload.indicators;

        dispatch({
          type: actions.LOAD_EXPORTERS, exporters
        });

        dispatch({
          type: actions.LOAD_CONSUMPTION_COUNTRIES, consumptionCountries
        });

        dispatch({
          type: actions.LOAD_INDICATORS, indicators
        });
      });
  };
}
