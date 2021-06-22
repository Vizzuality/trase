import trim from 'lodash/trim';
import qs from 'qs';
import pluralize from 'utils/pluralize';

export const GET_CONTEXTS_URL = 'GET_CONTEXTS_URL';
export const GET_TOP_PROFILES = 'GET_TOP_PROFILES';
export const GET_TOOLTIPS_URL = 'GET_TOOLTIPS_URL';
export const GET_ALL_NODES_URL = 'GET_ALL_NODES_URL';
export const GET_NODES_WITH_SEARCH_URL = 'GET_NODES_WITH_SEARCH_URL';
export const GET_COLUMNS_URL = 'GET_COLUMNS_URL';
export const GET_NODE_ATTRIBUTES_URL = 'GET_NODE_ATTRIBUTES_URL';
export const GET_FLOWS_URL = 'GET_FLOWS_URL';
export const GET_MAP_BASE_DATA_URL = 'GET_MAP_BASE_DATA_URL';
export const GET_LINKED_GEO_IDS_URL = 'GET_LINKED_GEO_IDS_URL';
export const GET_INDICATORS_URL = 'GET_INDICATORS_URL';
export const GET_JSON_DATA_DOWNLOAD_FILE_URL = 'GET_JSON_DATA_DOWNLOAD_FILE_URL';
export const GET_CSV_DATA_DOWNLOAD_FILE_URL = 'GET_CSV_DATA_DOWNLOAD_FILE_URL';
export const GET_DISCLAIMER_URL = 'GET_DISCLAIMER_URL';
export const POST_SUBSCRIBE_NEWSLETTER_URL = 'POST_SUBSCRIBE_NEWSLETTER_URL';
export const GET_TWEETS_URL = 'GET_TWEETS_URL';
export const GET_POSTS_URL = 'GET_POSTS_URL';
export const GET_TESTIMONIALS_URL = 'GET_TESTIMONIALS_URL';
export const GET_MARKDOWN_CONTENT_URL = 'GET_MARKDOWN_CONTENT_URL';
export const GET_TEAM_URL = 'GET_TEAM_URL';
export const GET_TOP_NODES_URL = 'GET_TOP_NODES_URL';
export const GET_TOP_NODE_STATS_URL = 'GET_TOP_NODE_STATS_URL';
export const GET_NODE_SUMMARY_URL = 'GET_NODE_SUMMARY_URL';
export const GET_COUNTRY_NODE_SUMMARY_URL = 'GET_COUNTRY_NODE_SUMMARY_URL';
export const GET_PROFILE_OPTIONS_TABS_URL = 'GET_PROFILE_OPTIONS_TABS_URL';
export const GET_PROFILE_METADATA = 'GET_PROFILE_METADATA';
export const GET_PLACE_INDICATORS = 'GET_PLACE_INDICATORS';
export const GET_ACTOR_TOP_COUNTRIES = 'GET_ACTOR_TOP_COUNTRIES';
export const GET_ACTOR_TOP_SOURCES = 'GET_ACTOR_TOP_SOURCES';
export const GET_PLACE_DEFORESTATION_TRAJECTORY = 'GET_PLACE_DEFORESTATION_TRAJECTORY';
export const GET_PLACE_TOP_CONSUMER_ACTORS = 'GET_PLACE_TOP_CONSUMER_ACTORS';
export const GET_PLACE_TOP_CONSUMER_COUNTRIES = 'GET_PLACE_TOP_CONSUMER_COUNTRIES';
export const GET_COUNTRY_TOP_CONSUMER_COUNTRIES = 'GET_COUNTRY_TOP_CONSUMER_COUNTRIES';
export const GET_ACTOR_SUSTAINABILITY = 'GET_ACTOR_SUSTAINABILITY';
export const GET_ACTOR_EXPORTING_COMPANIES = 'GET_ACTOR_EXPORTING_COMPANIES';
export const GET_DASHBOARD_OPTIONS_URL = 'GET_DASHBOARD_OPTIONS_URL';
export const GET_DASHBOARD_OPTIONS_TABS_URL = 'GET_DASHBOARD_OPTIONS_TABS_URL';
export const GET_DASHBOARD_TEMPLATES_URL = 'GET_DASHBOARD_TEMPLATES_URL';
export const GET_DASHBOARD_SEARCH_RESULTS_URL = 'GET_DASHBOARD_SEARCH_RESULTS_URL';
export const GET_DASHBOARD_PARAMETRISED_CHARTS_URL = 'GET_DASHBOARD_PARAMETRISED_CHARTS_URL';
export const GET_TOP_COUNTRIES_FACTS = 'GET_TOP_COUNTRIES_FACTS';
export const GET_SANKEY_CARD_LINKS = 'GET_SANKEY_CARD_LINKS';

const API_ENDPOINTS = {
  [GET_CONTEXTS_URL]: { api: 3, endpoint: '/contexts' },
  [GET_FLOWS_URL]: { api: 3, endpoint: '/contexts/$context_id$/flows' },
  [GET_COLUMNS_URL]: { api: 3, endpoint: '/contexts/$context_id$/columns' },
  [GET_ALL_NODES_URL]: { api: 3, endpoint: '/contexts/$context_id$/nodes' },
  [GET_NODES_WITH_SEARCH_URL]: { api: 3, endpoint: '/nodes/search' },
  [GET_NODE_ATTRIBUTES_URL]: { api: 3, endpoint: '/contexts/$context_id$/nodes/attributes' },
  [GET_MAP_BASE_DATA_URL]: { api: 3, endpoint: '/contexts/$context_id$/map_layers' },
  [GET_INDICATORS_URL]: { api: 3, endpoint: '/contexts/$context_id$/download_attributes' },
  [GET_CSV_DATA_DOWNLOAD_FILE_URL]: { api: 3, endpoint: '/contexts/$context_id$/download.csv' },
  [GET_JSON_DATA_DOWNLOAD_FILE_URL]: { api: 3, endpoint: '/contexts/$context_id$/download.json' },
  [GET_LINKED_GEO_IDS_URL]: { api: 3, endpoint: '/contexts/$context_id$/linked_nodes' },
  [POST_SUBSCRIBE_NEWSLETTER_URL]: { api: 3, endpoint: '/newsletter_subscriptions' },
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
  [GET_TOP_NODES_URL]: { api: 3, endpoint: '/contexts/$context_id$/top_nodes' },
  [GET_TOP_NODE_STATS_URL]: { api: 3, endpoint: '/nodes_stats' },
  [GET_NODE_SUMMARY_URL]: {
    api: 3,
    endpoint: '/contexts/$context_id$/$profile_type$/$node_id$/basic_attributes'
  },
  [GET_COUNTRY_NODE_SUMMARY_URL]: {
    api: 3,
    endpoint: '/country_profiles/$node_id$/basic_attributes'
  },
  [GET_PLACE_INDICATORS]: {
    api: 3,
    endpoint: '/contexts/$context_id$/places/$node_id$/indicators'
  },
  [GET_ACTOR_TOP_COUNTRIES]: {
    api: 3,
    endpoint: '/contexts/$context_id$/actors/$node_id$/top_countries'
  },
  [GET_ACTOR_TOP_SOURCES]: {
    api: 3,
    endpoint: '/contexts/$context_id$/actors/$node_id$/top_sources'
  },
  [GET_ACTOR_SUSTAINABILITY]: {
    api: 3,
    endpoint: '/contexts/$context_id$/actors/$node_id$/sustainability'
  },
  [GET_ACTOR_EXPORTING_COMPANIES]: {
    api: 3,
    endpoint: '/contexts/$context_id$/actors/$node_id$/exporting_companies'
  },
  [GET_PLACE_DEFORESTATION_TRAJECTORY]: {
    api: 3,
    endpoint: '/contexts/$context_id$/places/$node_id$/trajectory_deforestation'
  },
  [GET_PLACE_TOP_CONSUMER_ACTORS]: {
    api: 3,
    endpoint: '/contexts/$context_id$/places/$node_id$/top_consumer_actors'
  },
  [GET_PLACE_TOP_CONSUMER_COUNTRIES]: {
    api: 3,
    endpoint: '/contexts/$context_id$/places/$node_id$/top_consumer_countries'
  },
  [GET_COUNTRY_TOP_CONSUMER_COUNTRIES]: {
    api: 3,
    endpoint: '/country_profiles/$node_id$/top_consumer_countries'
  },
  [GET_DASHBOARD_OPTIONS_URL]: {
    api: 3,
    endpoint: '/dashboards/$options_type$'
  },
  [GET_DASHBOARD_OPTIONS_TABS_URL]: {
    api: 3,
    endpoint: '/dashboards/filter_meta'
  },
  [GET_DASHBOARD_TEMPLATES_URL]: {
    api: 3,
    endpoint: '/dashboards/templates'
  },
  [GET_DASHBOARD_SEARCH_RESULTS_URL]: {
    api: 3,
    endpoint: '/dashboards/$options_type$/search'
  },
  [GET_PROFILE_OPTIONS_TABS_URL]: {
    api: 3,
    endpoint: '/profiles/filter_meta'
  },
  [GET_PROFILE_METADATA]: {
    api: 3,
    endpoint: '/profiles/$node_id$/profile_meta'
  },
  [GET_DASHBOARD_PARAMETRISED_CHARTS_URL]: {
    api: 3,
    endpoint: '/dashboards/parametrised_charts'
  },
  [GET_TOP_COUNTRIES_FACTS]: { api: 3, endpoint: '/commodities/$commodity_id$/countries_facts' },
  [GET_TOP_PROFILES]: {
    api: 3,
    endpoint: '/top_profiles'
  },
  [GET_SANKEY_CARD_LINKS]: {
    api: 3,
    endpoint: '/sankey_card_links'
  }
};

function replaceURLParams(endpoint, params) {
  const regex = /\$[^$]+\$/g;

  const urlParams = endpoint.match(regex) || [];
  urlParams
    .map(p => trim(p, '$'))
    .forEach(param => {
      if (!Object.prototype.hasOwnProperty.call(params, param)) {
        throw new Error(`URL param ${param} not found in params object`);
      }

      endpoint = endpoint.replace(`$${param}$`, params[param]);
      delete params[param];
    });

  return endpoint;
}

const parseParams = params => {
  if (!params.profile_type) return params;
  return { ...params, profile_type: pluralize(params.profile_type) };
};

export function getURLForV3(endpoint, paramsArg = {}) {
  const params = parseParams(Object.assign({}, paramsArg));
  const apiEndpoint = replaceURLParams(endpoint, params);
  const queryParams = qs.stringify(params, { arrayFormat: 'brackets', encodeValuesOnly: true });
  return `${API_V3_URL}${apiEndpoint}${queryParams.length > 0 ? `?${queryParams}` : ''}`;
}

export const getSummaryEndpoint = profileType =>
  profileType === 'country' ? GET_COUNTRY_NODE_SUMMARY_URL : GET_NODE_SUMMARY_URL;

export function getURLFromParams(endpointKey, params = {}, mock = false) {
  const endpointData = API_ENDPOINTS[endpointKey];

  if (!mock) {
    switch (endpointData.api) {
      case 3:
        return getURLForV3(`/api/v3${endpointData.endpoint}`, params);
      case 'local':
        return `/${endpointData.endpoint}`;
      case 'content':
        return `${API_V3_URL}/content${endpointData.endpoint}`;
      case 'markdown':
        return `${API_V3_URL}/content/${params.filename}.md`;
      default:
        console.warn('Unmatched route found at router');
        return null;
    }
  } else {
    return endpointData.mock;
  }
}
