export const GET_CONTEXTS = 'GET_CONTEXTS';
export const GET_TOOLTIPS = 'GET_TOOLTIPS';
export const GET_ALL_NODES = 'GET_ALL_NODES';
export const GET_COLUMNS = 'GET_COLUMNS';
export const GET_NODES = 'GET_NODES';
export const GET_FLOWS = 'GET_FLOWS';
export const GET_MAP_BASE_DATA = 'GET_MAP_BASE_DATA';
export const GET_LINKED_GEO_IDS = 'GET_LINKED_GEO_IDS';
export const GET_PLACE_FACTSHEET = 'GET_PLACE_FACTSHEET';
export const GET_ACTOR_FACTSHEET = 'GET_ACTOR_FACTSHEET';
export const GET_INDICATORS = 'GET_INDICATORS';
export const GET_JSON_DATA_DOWNLOAD_FILE = 'GET_JSON_DATA_DOWNLOAD_FILE';
export const GET_CSV_DATA_DOWNLOAD_FILE = 'GET_CSV_DATA_DOWNLOAD_FILE';
export const GET_DISCLAIMER = 'GET_DISCLAIMER';
export const POST_SUBSCRIBE_NEWSLETTER = 'POST_SUBSCRIBE_NEWSLETTER';

const API_ENDPOINTS = {
  [GET_DISCLAIMER]: { api: 'local', endpoint: 'disclaimer.json' },
  [GET_TOOLTIPS]: { api: 'local', endpoint: 'tooltips.json' },
  [GET_CONTEXTS]: { api: 2, endpoint: '/get_contexts' },
  [GET_ALL_NODES]: { api: 2, endpoint: '/get_all_nodes' },
  [GET_COLUMNS]: { api: 2, endpoint: '/get_columns' },
  [GET_NODES]: { api: 1, endpoint: '/get_nodes' },
  [GET_FLOWS]: { api: 1, endpoint: '/get_flows' },
  [GET_MAP_BASE_DATA]: { api: 2, endpoint: '/get_map_base_data' },
  [GET_LINKED_GEO_IDS]: { api: 2, endpoint: '/get_linked_geoids' },
  [GET_PLACE_FACTSHEET]: { api: 2, endpoint: '/get_place_node_attributes', mock: 'mocks/v1_get_place_node_attributes.json' },
  [GET_ACTOR_FACTSHEET]: { api: 2, endpoint: '/get_actor_node_attributes', mock: 'mocks/v1_get_actor_node_attributes.json' },
  [GET_INDICATORS]: { api: 2, endpoint: '/indicators' },
  [GET_CSV_DATA_DOWNLOAD_FILE]: { api: 2, endpoint: '/download.csv' },
  [GET_JSON_DATA_DOWNLOAD_FILE]: { api: 2, endpoint: '/download.json' },
  [POST_SUBSCRIBE_NEWSLETTER]: { api: 2, endpoint: '/newsletter_subscriptions' },
};

function getURLForV2(endpoint, params = {}) {
  return Object.keys(params).reduce((prev, current) => {
    const value = params[current];
    if (Array.isArray(value)) {
      const arrUrl = value.reduce((arrPrev, arrCurrent) => {
        return `${arrPrev}&${current}[]=${arrCurrent}`;
      }, '');
      return `${prev}&${arrUrl}`;
    }
    return `${prev}&${current}=${params[current]}`;
  }, `${API_V2_URL}${endpoint}?`);
}

// builds an URL usable to call the API, using params
function getURLForV1(endpoint, params = {}) {
  return Object.keys(params).reduce((prev, current) => {
    const value = params[current];
    if (Array.isArray(value)) {
      const arrUrl = value.reduce((arrPrev, arrCurrent) => {
        return `${arrPrev}&${current}=${arrCurrent}`;
      }, '');
      return `${prev}&${arrUrl}`;
    }
    return `${prev}&${current}=${params[current]}`;
  }, `${API_V1_URL}${endpoint}?`);
}
// builds an URL usable to call the API, using params
function getURLForLocal(endpoint, params = {}) {
  return Object.keys(params).reduce((prev, current) => {
    const value = params[current];
    if (Array.isArray(value)) {
      const arrUrl = value.reduce((arrPrev, arrCurrent) => {
        return `${arrPrev}&${current}=${arrCurrent}`;
      }, '');
      return `${prev}&${arrUrl}`;
    }
    return `${prev}&${current}=${params[current]}`;
  }, `/${endpoint}?`);
}

export function getURLFromParams(endpointKey, params = {}, mock = false) {
  const endpointData = API_ENDPOINTS[endpointKey];

  if (!mock) {
    switch (endpointData.api) {
      case 2:
        return getURLForV2(endpointData.endpoint, params);
      case 1:
        return getURLForV1(`/v1${endpointData.endpoint}`, params);
      case 'local':
        return getURLForLocal(endpointData.endpoint, params);
    }
  } else {
    return endpointData.mock;
  }
}
