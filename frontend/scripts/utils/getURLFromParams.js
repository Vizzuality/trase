export const GET_CONTEXTS = 'GET_CONTEXTS';
export const GET_TOOLTIPS = 'GET_TOOLTIPS';
export const GET_ALL_NODES = 'GET_ALL_NODES';
export const GET_COLUMNS = 'GET_COLUMNS';
export const GET_NODE_ATTRIBUTES = 'GET_NODE_ATTRIBUTES';
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
export const GET_TWEETS = 'GET_TWEETS';
export const GET_POSTS = 'GET_POSTS';
export const GET_SITE_DIVE = 'GET_SITE_DIVE';
export const GET_TESTIMONIALS = 'GET_TESTIMONIALS';
export const GET_PROMOTED_STORY = 'GET_PROMOTED_STORY';
export const GET_FEATURES_POSTS = 'GET_FEATURES_POSTS';

const API_ENDPOINTS = {
  [GET_CONTEXTS]: { api: 3, endpoint: '/contexts' },
  [GET_FLOWS]: { api: 3, endpoint: '/contexts/$context_id$/flows' },
  [GET_COLUMNS]: { api: 3, endpoint: '/contexts/$context_id$/columns' },
  [GET_ALL_NODES]: { api: 3, endpoint: '/contexts/$context_id$/nodes' },
  [GET_NODE_ATTRIBUTES]: { api: 3, endpoint: '/contexts/$context_id$/nodes/attributes' },
  [GET_MAP_BASE_DATA]: { api: 3, endpoint: '/contexts/$context_id$/map_groups' },
  [GET_INDICATORS]: { api: 3, endpoint: '/contexts/$context_id$/download_attributes' },
  [GET_PLACE_FACTSHEET]: {
    api: 3,
    endpoint: '/contexts/$context_id$/nodes/$node_id$/place',
    mock: 'mocks/v1_get_place_node_attributes.json'
  },
  [GET_ACTOR_FACTSHEET]: {
    api: 3,
    endpoint: '/contexts/$context_id$/nodes/$node_id$/actor',
    mock: 'mocks/v1_get_actor_node_attributes.json'
  },
  [GET_CSV_DATA_DOWNLOAD_FILE]: { api: 3, endpoint: '/contexts/$context_id$/download.csv' },
  [GET_JSON_DATA_DOWNLOAD_FILE]: { api: 3, endpoint: '/contexts/$context_id$/download.json' },
  [GET_LINKED_GEO_IDS]: { api: 3, endpoint: '/contexts/$context_id$/linked_nodes' },
  [POST_SUBSCRIBE_NEWSLETTER]: { api: 3, endpoint: '/newsletter_subscriptions' },
  [GET_SITE_DIVE]: { api: 'content', endpoint: '/site_dive' },
  [GET_POSTS]: { api: 'content', endpoint: '/posts' },
  [GET_TWEETS]: { api: 'content', endpoint: '/tweets' },
  [GET_DISCLAIMER]: { api: 'local', endpoint: 'disclaimer.json' },
  [GET_TOOLTIPS]: { api: 'local', endpoint: 'tooltips.json' },
  [GET_TESTIMONIALS]: { api: 'content', endpoint: '/testimonials', mock: 'mocks/v3_get_testimonials.json' },
  [GET_PROMOTED_STORY]: { api: 'content', endpoint: '/featured-story', mock: 'mocks/v3_get_promoted_post.json' },
  [GET_FEATURES_POSTS]: {
    api: 'content',
    endpoint: '/posts?category=features',
    mock: 'mocks/v3_get_features_posts.json'
  }
};

function getURLForV3(endpoint, paramsArg = {}) {
  const params = Object.assign({}, paramsArg);
  if (Object.prototype.hasOwnProperty.call(params, 'context_id') && endpoint.indexOf('$context_id$') !== -1) {
    endpoint = endpoint.replace('$context_id$', params.context_id);
    delete params.context_id;
  }
  if (Object.prototype.hasOwnProperty.call(params, 'node_id') && endpoint.indexOf('$node_id$') !== -1) {
    endpoint = endpoint.replace('$node_id$', params.node_id);
    delete params.node_id;
  }

  const queryParams = Object.keys(params).reduce((prev, current) => {
    const value = params[current];
    if (Array.isArray(value)) {
      if (value.length === 0) return prev;
      const arrUrl = value.reduce((arrPrev, arrCurrent) => `${arrPrev}&${current}[]=${arrCurrent}`, '');
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
      const arrUrl = value.reduce((arrPrev, arrCurrent) => `${arrPrev}&${current}[]=${arrCurrent}`, '');
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
      const arrUrl = value.reduce((arrPrev, arrCurrent) => `${arrPrev}&${current}=${arrCurrent}`, '');
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
      default:
        console.warn('Unmatched route found at router');
        return null;
    }
  } else {
    return endpointData.mock;
  }
}
