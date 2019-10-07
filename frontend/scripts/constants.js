/* eslint-disable max-len */
export const NUM_DECIMALS = {
  // resize by
  'trade volume': 0,
  'land use': 0,
  'financial flow': 0,
  'territorial deforestation': 0,
  'maximum soy deforestation': 0,
  'soy deforestation (currently only available for the cerrado and only up until 2014)': 0,
  'soy deforestation': 0,
  // map dimensions
  'average soy yield': 3,
  '% soy of total farming land': 1,
  'land based co2 emissions': 0,
  'water scarcity': 0,
  'loss of amphibian habitat': 0,
  'area affected by fires in 2013': 0,
  'permanent protected area (ppa) deficit': 0,
  'legal reserve (lr) deficit': 0,
  'forest code deficit': 1,
  'number of environmental embargos (2015)': 0,
  '% of soy under zero deforestation commitments': 1,
  'human development index': 3,
  'gdp per capita': 0,
  '% gdp from agriculture': 3,
  'smallholder dominance': 3,
  'reported cases of forced labour (2014)': 0,
  'land conflicts (2014)': 0,
  commodity_area: 0,
  commodity_production: 0,
  // generic
  area: 0,
  percentage: 1,
  tons: 0
};

export const NUM_DECIMALS_DEFAULT = 1;

export const UNITLESS_UNITS = ['Unitless', 'Number', 'Head', 'Number', 'NA'];

// flows
export const NUM_COLUMNS = 4;
export const NUM_NODES_SUMMARY = 10;
export const NUM_NODES_EXPANDED = 100;
export const NUM_NODES_DETAILED = 999;
export const DETAILED_VIEW_SCALE = 1200;
export const DETAILED_VIEW_MIN_NODE_HEIGHT = 14;
export const DETAILED_VIEW_MIN_LINK_HEIGHT = 1;

export const COLORS = {
  white: '#FFFFFF',
  gray: '#DFDFDF',
  charcoalGrey: '#34444C',
  charcoalGreyTonedDown: '#536269',
  charcoalGreyFadedALot: '#D6DADB',
  manilla: '#FFEB8B'
};

export const CHOROPLETH_CLASS_ZERO = '#FFFFFF';
export const CHOROPLETH_COLORS = {
  bidimensional: [
    ['#F6F5ED', '#CFE7DF', '#A4D2CF', '#8DB6CA'],
    ['#F5D0B9', '#C6C6B9', '#91B4B5', '#7F90A4'],
    ['#F5928D', '#C18686', '#84747A', '#635B69'],
    ['#F65E6E', '#C55966', '#864F57', '#443537']
  ],
  horizontal: ['#F5EEE3', '#F5B7AD', '#EF4F60', '#B41728', '#4F0008'],
  vertical: ['#EAF2EB', '#A1D9D5', '#8DB6CA', '#3881A4', '#06425F'],
  red: ['#F5EEE3', '#F5B7AD', '#EF4F60', '#B41728', '#4F0008'],
  blue: ['#EAF2EB', '#A1D9D5', '#8DB6CA', '#3881A4', '#06425F'],
  green: ['#ffc', '#c2e699', '#78c679', '#31a354', '#006837'],
  bluered: ['#79A8D0', '#C2DFED', '#FFFECC', '#FFBD78', '#E54935'],
  bluered8: [
    '#246AB6',
    '#5488C0',
    '#9FCAE1',
    '#E5F5F9',
    '#FFFECC',
    '#FFE6A4',
    '#FFA16F',
    '#E54935'
  ],
  redblue: ['#E54935', '#FFBD78', '#FFFECC', '#C2DFED', '#79A8D0'],
  greenred: ['#70C67A', '#B0DE82', '#FFFECC', '#FFBD78', '#E54935'],
  greenred12: [
    '#006837',
    '#1a9850',
    '#66bd63',
    '#a6d96a',
    '#d9ef8b',
    '#ffffbf',
    '#fee08b',
    '#fdae61',
    '#f46d43',
    '#d73027',
    '#a50026',
    '#6f001a'
  ],
  error_no_metadata: COLORS.gray,
  error_no_metadata_for_layer: COLORS.gray,
  default_fill: COLORS.white,
  fill_linked: COLORS.manilla,
  fill_not_linked: COLORS.gray,
  bright_stroke: COLORS.white,
  dark_stroke: COLORS.charcoalGreyTonedDown,
  zero: COLORS.white
};

export const PROFILE_CHOROPLETH_CLASSES = [
  'ch-red-0',
  'ch-red-1',
  'ch-red-2',
  'ch-red-3',
  'ch-red-4'
];

export const DOCUMENT_POST_TYPES = ['INFO BRIEF', 'ISSUE BRIEF'];

export const NODE_SELECTION_LINKS_NUM_COLORS = 10;
export const SANKEY_TRANSITION_TIME = 1000;

// fact sheets
export const ACTORS_TOP_SOURCES_SWITCHERS_BLACKLIST = ['included_years', 'buckets'];
export const LINE_LABEL_HEIGHT = 12;

// map
export const CARTO_BASE_URL = 'https://p2cs-sei.carto.com/api/v1/map/';
export const CARTO_NAMED_MAPS_BASE_URL = 'https://p2cs-sei.carto.com/api/v1/map/named/';
export const YEARS_DISABLED_WARNINGS = {
  NO_AGGR_REASON: "can't be displayed over multiple years.",
  NO_AGGR_INSTRUCTION: 'Please modify year selection to a single year.',
  UNAVAILABLE_REASON: "is only available for $years and can't be displayed for the selected years.",
  UNAVAILABLE_INSTRUCTION: 'Please change year selection.',
  INCOMPLETE_REASON: "doesn't have data for all selected years.",
  INCOMPLETE_INSTRUCTION: 'Data being displayed corresponds to the following years: $years.',
  THIS_LAYER: 'This layer',
  THAT_LAYER: 'The selected map layer ($layer)',
  THOSE_LAYERS: 'The selected map layers ($layer0 and $layer1)'
};

export const YEARS_DISABLED_NO_AGGR = 'NO_AGGR';
export const YEARS_DISABLED_UNAVAILABLE = 'UNAVAILABLE';
export const YEARS_INCOMPLETE = 'INCOMPLETE';

export const MAP_PANES = {
  basemap: 'basemap',
  contextBelow: 'contextBelow',
  vectorBelow: 'vectorBelow',
  vectorMain: 'vectorMain',
  vectorOutline: 'vectorOutline',
  context: 'context',
  basemapLabels: 'basemapLabels',
  overlayPane: 'overlayPane'
};
export const MAP_PANES_Z = {
  [MAP_PANES.basemap]: 200,
  [MAP_PANES.contextBelow]: 400,
  [MAP_PANES.vectorBelow]: 409,
  [MAP_PANES.vectorMain]: 410,
  [MAP_PANES.vectorOutline]: 412,
  [MAP_PANES.context]: 420,
  [MAP_PANES.basemapLabels]: 490,
  [MAP_PANES.overlayPane]: 408 // when using canvas mode, better should be behind all vector layers, canvas not passing through pointer events
};

export const BASEMAPS = {
  default: {
    id: 'default',
    title: 'Default',
    url:
      'https://api.mapbox.com/styles/v1/trasebase/cizi55y2r00122rl65a97ppz1/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidHJhc2ViYXNlIiwiYSI6ImNpemk1NWdhOTAwMmYyeGw5dXRncHpvZGEifQ.fQ6F9DSqmhLXZs-nKiYvzA',
    labelsUrl:
      'https://api.mapbox.com/styles/v1/trasebase/cj8086t6u7ias2sjs820bkw7w/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidHJhc2ViYXNlIiwiYSI6ImNpemk1NWdhOTAwMmYyeGw5dXRncHpvZGEifQ.fQ6F9DSqmhLXZs-nKiYvzA',
    attribution:
      '<span>&copy;</span> <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <span>&copy;</span> <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
    thumbnail: '/images/maps/thumb-basemap-default.png'
  },
  satellite: {
    id: 'satellite',
    title: 'Satellite',
    url:
      'https://api.mapbox.com/styles/v1/trasebase/cj808lpze6d6o2st3yim6eedl/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidHJhc2ViYXNlIiwiYSI6ImNpemk1NWdhOTAwMmYyeGw5dXRncHpvZGEifQ.fQ6F9DSqmhLXZs-nKiYvzA',
    labelsUrl:
      'https://api.mapbox.com/styles/v1/trasebase/cj8ydw4b1ao4q2slhzdmz0izw/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidHJhc2ViYXNlIiwiYSI6ImNpemk1NWdhOTAwMmYyeGw5dXRncHpvZGEifQ.fQ6F9DSqmhLXZs-nKiYvzA',
    attribution:
      '<a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a>, <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, <a href="https://www.digitalglobe.com/" target="_blank">DigitalGlobe</a>',
    thumbnail: '/images/maps/thumb-basemap-satellite.jpeg',
    dark: true
  },
  topo: {
    id: 'topo',
    title: 'Topography',
    url: '//{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy;<a href="http://opentopomap.org">opentopomap.org</a>',
    thumbnail: '/images/maps/thumb-basemap-topo.png'
  },
  streets: {
    id: 'streets',
    title: 'Streets (OSM)',
    url: '//{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution:
      '&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
    thumbnail: '/images/maps/thumb-basemap-streets.png'
  }
};

export const DEFAULT_BASEMAP_FOR_CHOROPLETH = 'default';

export const EXPLORE_COLUMN_LIST = [
  {
    value: 'exporter',
    type: 'exporter',
    label: 'Top Exporting Companies',
    link: !DISABLE_PROFILES && { type: 'profileNode', payload: { profileType: 'actor' } },
    fallbackText: 'exporting companies'
  },
  {
    value: 'country',
    type: 'country',
    label: 'Top Sourcing Countries',
    fallbackText: 'sourcing countries'
  }
];

export const HOME_VIDEO = {
  en: 'wMnAQJBptj8',
  es: 'kuJAEzISoEA',
  pt_BR: 'OZ6fxiYDy5I',
  id: '5MBiOMELLlA'
};

export const BREAKPOINTS = {
  mobile: 425,
  small: 640,
  tablet: 768
};

export const MAX_SEARCH_RESULTS = 50;

export const LOGISTICS_MAP_YEARS = Array.from({ length: 12 })
  .fill(2016)
  .map((y, i) => ({ value: y - i, label: `${y - i}` }));

export const LOGISTICS_MAP_HUBS = [
  { value: 'soy', label: 'Soy' },
  { value: 'cattle', label: 'Cattle' },
  { value: 'palmOil', label: 'Palm oil' }
];

export const LOGISTICS_MAP_INSPECTION_LEVELS = [
  { value: 'SIF', label: 'SIF' },
  { value: 'SIE', label: 'SIE' },
  { value: 'SIM', label: 'SIM' },
  { value: 'UNKNOWN', label: 'Unknown' }
];

export const EXPLORE_STEPS = {
  selectCommodity: 0,
  selectCountry: 1,
  selected: 2
};

export const DASHBOARD_STEPS = {
  welcome: 0,
  sources: 1,
  commodities: 2,
  destinations: 3,
  companies: 4
};

export const PROFILE_STEPS = {
  type: 0,
  profiles: 1,
  commodities: 2
};

export const CHART_TYPES = {
  bar: 'bar',
  pie: 'pie',
  ranking: 'ranking',
  stackedBar: 'stackedBar',
  dynamicSentence: 'dynamicSentence',
  horizontalBar: 'horizontalBar',
  horizontalStackedBar: 'horizontalStackedBar',
  nodeIndicatorSentence: 'nodeIndicatorSentence'
};

export const NAV_FILTER_TYPES = {
  contextSelector: 0,
  yearSelector: 1,
  dropdown: 2,
  recolorBySelector: 3
};

export const PROFILE_TYPES = {
  sources: 'sources',
  importing: 'destinations',
  traders: 'companies'
};

export const DEFAULT_DASHBOARD_UNIT_FORMAT = '.4~s';

export const NODE_TYPE_PANELS = {
  IMPORTER: 'companies',
  EXPORTER: 'companies',
  BIOME: 'sources',
  STATE: 'sources',
  MUNICIPALITY: 'sources',
  COUNTRY: 'destinations'
};

export const WORLD_MAP_ASPECT_RATIO = 0.56;

export const TOOL_LAYOUT = {
  left: 0,
  splitted: 1,
  right: 2
};

export const SANKEY_OFFSETS = {
  height: 175,
  width: 120,
  splittedWidth: 392
};

export const LAYER_TAB_NAMES = {
  unit: 'unit layers',
  contextual: 'contextual layers'
};
