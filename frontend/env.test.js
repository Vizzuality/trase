// IMPORTANT: update .travis.yml when adding new stuff
// DON'T ADD SECRETS HERE

module.exports = {
  PORT: 3000,
  API_V3_URL: '//0.0.0.0:3000',
  UNIT_LAYERS_API_URL: '//sandbox.trase.earth',
  UNIT_LAYERS_DATA_ENV: 'sandbox',
  NAMED_MAPS_ENV: 'development',
  GFW_WIDGETS_BASE_URL: undefined,
  MAPBOX_TOKEN: undefined,
  NODE_ENV_DEV: false,

  // feature flags
  USE_SERVICE_WORKER: true,
  USE_CANVAS_MAP: true,
  ALWAYS_DISPLAY_DASHBOARD_INFO: true,
  DATA_DOWNLOAD_ENABLED: true,
  DATA_FORM_ENABLED: true,
  ENABLE_DASHBOARDS: true,
  DISABLE_PROFILES: false,
  ENABLE_LEGACY_TOOL_SEARCH: false,
  SHOW_WORLD_MAP_IN_EXPLORE: false,
  ENABLE_INTERSECTION_OBSERVER: false,
  ENABLE_VERSIONING: true,
  ENABLE_TOOL_PANEL: true,
  CONSOLIDATE_INSIGHTS: true,
  ENABLE_COUNTRY_PROFILES: true,
  ENABLE_LOGISTIC_LAYERS_TAB: false
};
