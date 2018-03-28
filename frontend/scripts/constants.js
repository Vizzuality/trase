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
  // generic
  area: 0,
  percentage: 1,
  tons: 0
};
export const DEFAULT_PROFILE_PAGE_YEAR = 2015;

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

export const CHOROPLETH_CLASS_ZERO = '#FFFFFF';
export const CHOROPLETH_COLORS = {
  bidimensional: {
    0: {
      0: '#F6F5ED',
      1: '#CFE7DF',
      2: '#A4D2CF',
      3: '#8DB6CA'
    },
    1: {
      0: '#F5D0B9',
      1: '#C6C6B9',
      2: '#91B4B5',
      3: '#7F90A4'
    },
    2: {
      0: '#F5928D',
      1: '#C18686',
      2: '#84747A',
      3: '#635B69'
    },
    3: {
      0: '#F65E6E',
      1: '#C55966',
      2: '#864F57',
      3: '#443537'
    }
  },
  horizontal: {
    0: '#F5EEE3',
    1: '#F5B7AD',
    2: '#EF4F60',
    3: '#B41728',
    4: '#4F0008'
  },

  vertical: {
    0: '#EAF2EB',
    1: '#A1D9D5',
    2: '#8DB6CA',
    3: '#3881A4',
    4: '#06425F'
  },
  red: {
    0: '#F5EEE3',
    1: '#F5B7AD',
    2: '#EF4F60',
    3: '#B41728',
    4: '#4F0008'
  },
  blue: {
    0: '#EAF2EB',
    1: '#A1D9D5',
    2: '#8DB6CA',
    3: '#3881A4',
    4: '#06425F'
  },
  green: {
    0: '#ffc',
    1: '#c2e699',
    2: '#78c679',
    3: '#31a354',
    4: '#006837'
  },
  bluered: {
    4: '#79A8D0',
    3: '#C2DFED',
    2: '#FFFECC',
    1: '#FFBD78',
    0: '#E54935'
  },
  redblue: {
    0: '#E54935',
    1: '#FFBD78',
    2: '#FFFECC',
    3: '#C2DFED',
    4: '#79A8D0'
  },
  greenred: {
    4: '#70C67A',
    3: '#B0DE82',
    2: '#FFFECC',
    1: '#FFBD78',
    0: '#E54935'
  },
  error_no_metadata: '#DFDFDF',
  error_no_metadata_for_layer: '#DFDFDF',
  default_fill: '#FFFFFF',
  fill_linked: '#FFEB8B',
  fill_not_linked: '#DFDFDF',
  bright_stroke: '#FFFFFF',
  dark_stroke: '#536269',
  zero: '#FFFFFF'
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
  UNAVAILABLE_REASON: "can't be displayed for the selected years.",
  UNAVAILABLE_INSTRUCTION: 'Please change year selection.',
  THIS_LAYER: 'This layer',
  THAT_LAYER: 'The selected map layer ($layer)',
  THOSE_LAYERS: 'The selected map layers ($layer0 and $layer1)'
};

export const YEARS_DISABLED_NO_AGGR = 'NO_AGGR';
export const YEARS_DISABLED_UNAVAILABLE = 'UNAVAILABLE';

export const MAP_PANES = {
  basemap: 'basemap',
  contextBelow: 'contextBelow',
  vectorMain: 'vectorMain',
  vectorOutline: 'vectorOutline',
  context: 'context',
  basemapLabels: 'basemapLabels',
  overlayPane: 'overlayPane'
};
export const MAP_PANES_Z = {
  [MAP_PANES.basemap]: 200,
  [MAP_PANES.contextBelow]: 400,
  [MAP_PANES.vectorMain]: 410,
  [MAP_PANES.vectorOutline]: 412,
  [MAP_PANES.context]: 420,
  [MAP_PANES.basemapLabels]: 490
};

export const BASEMAPS = {
  default: {
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
    title: 'Topography',
    url: '//{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy;<a href="http://opentopomap.org">opentopomap.org</a>',
    thumbnail: '/images/maps/thumb-basemap-topo.png'
  },
  streets: {
    title: 'Streets (OSM)',
    url: '//{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution:
      '&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
    thumbnail: '/images/maps/thumb-basemap-streets.png'
  }
};

export const DEFAULT_BASEMAP_FOR_CHOROPLETH = 'default';

export const HOME_VIDEO = {
  en: 'wMnAQJBptj8',
  es: 'kuJAEzISoEA',
  pt_BR: 'OZ6fxiYDy5I',
  id: '5MBiOMELLlA'
};

export const BREAKPOINTS = {
  small: 640
};
