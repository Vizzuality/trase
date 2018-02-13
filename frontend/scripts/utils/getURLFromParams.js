export const GET_CONTEXTS_URL = 'GET_CONTEXTS_URL';
export const GET_TOOLTIPS_URL = 'GET_TOOLTIPS_URL';
export const GET_ALL_NODES_URL = 'GET_ALL_NODES_URL';
export const GET_COLUMNS_URL = 'GET_COLUMNS_URL';
export const GET_NODE_ATTRIBUTES_URL = 'GET_NODE_ATTRIBUTES_URL';
export const GET_FLOWS_URL = 'GET_FLOWS_URL';
export const GET_MAP_BASE_DATA_URL = 'GET_MAP_BASE_DATA_URL';
export const GET_LINKED_GEO_IDS_URL = 'GET_LINKED_GEO_IDS_URL';
export const GET_PLACE_FACTSHEET_URL = 'GET_PLACE_FACTSHEET_URL';
export const GET_ACTOR_FACTSHEET_URL = 'GET_ACTOR_FACTSHEET_URL';
export const GET_INDICATORS_URL = 'GET_INDICATORS_URL';
export const GET_JSON_DATA_DOWNLOAD_FILE_URL = 'GET_JSON_DATA_DOWNLOAD_FILE_URL';
export const GET_CSV_DATA_DOWNLOAD_FILE_URL = 'GET_CSV_DATA_DOWNLOAD_FILE_URL';
export const GET_DISCLAIMER_URL = 'GET_DISCLAIMER_URL';
export const POST_SUBSCRIBE_NEWSLETTER_URL = 'POST_SUBSCRIBE_NEWSLETTER_URL';
export const GET_TWEETS_URL = 'GET_TWEETS_URL';
export const GET_POSTS_URL = 'GET_POSTS_URL';
export const GET_SITE_DIVE_URL = 'GET_SITE_DIVE_URL';
export const GET_TESTIMONIALS_URL = 'GET_TESTIMONIALS_URL';
export const GET_MARKDOWN_CONTENT_URL = 'GET_MARKDOWN_CONTENT_URL';
export const GET_TEAM_URL = 'GET_TEAM_URL';

const API_ENDPOINTS = {
  [GET_CONTEXTS_URL]: { api: 3, endpoint: '/contexts' },
  [GET_FLOWS_URL]: { api: 3, endpoint: '/contexts/$context_id$/flows' },
  [GET_COLUMNS_URL]: { api: 3, endpoint: '/contexts/$context_id$/columns' },
  [GET_ALL_NODES_URL]: { api: 3, endpoint: '/contexts/$context_id$/nodes' },
  [GET_NODE_ATTRIBUTES_URL]: { api: 3, endpoint: '/contexts/$context_id$/nodes/attributes' },
  [GET_MAP_BASE_DATA_URL]: { api: 3, endpoint: '/contexts/$context_id$/map_layers' },
  [GET_INDICATORS_URL]: { api: 3, endpoint: '/contexts/$context_id$/download_attributes' },
  [GET_PLACE_FACTSHEET_URL]: {
    api: 3,
    endpoint: '/contexts/$context_id$/nodes/$node_id$/place',
    mock: 'mocks/v1_get_place_node_attributes.json'
  },
  [GET_ACTOR_FACTSHEET_URL]: {
    api: 3,
    endpoint: '/contexts/$context_id$/nodes/$node_id$/actor',
    mock: 'mocks/v1_get_actor_node_attributes.json'
  },
  [GET_CSV_DATA_DOWNLOAD_FILE_URL]: { api: 3, endpoint: '/contexts/$context_id$/download.csv' },
  [GET_JSON_DATA_DOWNLOAD_FILE_URL]: { api: 3, endpoint: '/contexts/$context_id$/download.json' },
  [GET_LINKED_GEO_IDS_URL]: { api: 3, endpoint: '/contexts/$context_id$/linked_nodes' },
  [POST_SUBSCRIBE_NEWSLETTER_URL]: { api: 3, endpoint: '/newsletter_subscriptions' },
  [GET_SITE_DIVE_URL]: { api: 'content', endpoint: '/site_dive' },
  [GET_POSTS_URL]: { api: 'content', endpoint: '/posts' },
  [GET_TWEETS_URL]: { api: 'content', endpoint: '/tweets' },
  [GET_DISCLAIMER_URL]: { api: 'local', endpoint: 'disclaimer.json' },
  [GET_TOOLTIPS_URL]: { api: 'local', endpoint: 'tooltips.json' },
  [GET_TESTIMONIALS_URL]: {
    api: 'content',
    endpoint: '/testimonials',
    mock: 'mocks/v3_get_testimonials.json'
  },
  [GET_MARKDOWN_CONTENT_URL]: { api: 'markdown', endpoint: 'content' },
  [GET_TEAM_URL]: {
    api: 'content',
    endpoint: '/staff_groups',
    mock: '/mocks/v3_get_team.json'
  }
};

function getURLForV3(endpoint, paramsArg = {}) {
  const params = Object.assign({}, paramsArg);
  if (
    Object.prototype.hasOwnProperty.call(params, 'context_id') &&
    endpoint.indexOf('$context_id$') !== -1
  ) {
    endpoint = endpoint.replace('$context_id$', params.context_id);
    delete params.context_id;
  }
  if (
    Object.prototype.hasOwnProperty.call(params, 'node_id') &&
    endpoint.indexOf('$node_id$') !== -1
  ) {
    endpoint = endpoint.replace('$node_id$', params.node_id);
    delete params.node_id;
  }

  const queryParams = Object.keys(params).reduce((prev, current) => {
    const value = params[current];
    if (Array.isArray(value)) {
      if (value.length === 0) return prev;
      const arrUrl = value.reduce(
        (arrPrev, arrCurrent) => `${arrPrev}&${current}[]=${arrCurrent}`,
        ''
      );
      return `${prev}&${arrUrl}`;
    }
    return `${prev}&${current}=${params[current]}`;
  }, '');

  return `${API_V3_URL}${endpoint}${queryParams.length > 0 ? `?${queryParams}` : ''}`;
}

function getURLForV2(endpoint, params = {}) {
  return Object.keys(params).reduce((prev, current) => {
    const value = params[current];
    if (Array.isArray(value)) {
      const arrUrl = value.reduce(
        (arrPrev, arrCurrent) => `${arrPrev}&${current}[]=${arrCurrent}`,
        ''
      );
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
      const arrUrl = value.reduce(
        (arrPrev, arrCurrent) => `${arrPrev}&${current}=${arrCurrent}`,
        ''
      );
      return `${prev}&${arrUrl}`;
    }
    return `${prev}&${current}=${params[current]}`;
  }, `${API_V1_URL}${endpoint}?`);
}

export function getURLFromParams(endpointKey, params = {}, mock = false) {
  const endpointData = API_ENDPOINTS[endpointKey];

  if (!mock) {
    switch (endpointData.api) {
      case 3:
        return getURLForV3(`/api/v3${endpointData.endpoint}`, params);
      case 2:
        return getURLForV2(`/api/v2${endpointData.endpoint}`, params);
      case 1:
        return getURLForV1(`/v1${endpointData.endpoint}`, params);
      case 'local':
        return `/${endpointData.endpoint}`;
      case 'content':
        return `${API_V2_URL}/content${endpointData.endpoint}`;
      case 'markdown':
        return `${API_V2_URL}/content/${params.filename}.md`;
      default:
        console.warn('Unmatched route found at router');
        return null;
    }
  } else {
    return endpointData.mock;
  }
}
