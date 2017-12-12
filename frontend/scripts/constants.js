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
  'area': 0,
  'percentage': 1,
  'tons': 0
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

export const CHOROPLETH_CLASS_ZERO = 'ch-zero';
export const CHOROPLETH_CLASSES = {
  bidimensional: [
    'ch-bi-0-2', 'ch-bi-1-2', 'ch-bi-2-2',
    'ch-bi-0-1', 'ch-bi-1-1', 'ch-bi-2-1',
    'ch-bi-0-0', 'ch-bi-1-0', 'ch-bi-2-0'
  ],
  horizontal: ['ch-red-0', 'ch-red-1', 'ch-red-2', 'ch-red-3', 'ch-red-4'],
  vertical: ['ch-blue-0', 'ch-blue-1', 'ch-blue-2', 'ch-blue-3', 'ch-blue-4'],
  red: ['ch-red-0', 'ch-red-1', 'ch-red-2', 'ch-red-3', 'ch-red-4'],
  blue: ['ch-blue-0', 'ch-blue-1', 'ch-blue-2', 'ch-blue-3', 'ch-blue-4'],
  green: ['recolorby-percentual-yellow-green-0', 'recolorby-percentual-yellow-green-1', 'recolorby-percentual-yellow-green-2', 'recolorby-percentual-yellow-green-3', 'recolorby-percentual-yellow-green-4'],
  bluered: ['choro-red-blue-toned-down-4','choro-red-blue-toned-down-3','choro-red-blue-toned-down-2','choro-red-blue-toned-down-1','choro-red-blue-toned-down-0'],
  redblue: ['choro-red-blue-toned-down-0','choro-red-blue-toned-down-1','choro-red-blue-toned-down-2','choro-red-blue-toned-down-3','choro-red-blue-toned-down-4'],
  greenred: ['choro-red-green-toned-down-4','choro-red-green-toned-down-3','choro-red-green-toned-down-2','choro-red-green-toned-down-1','choro-red-green-toned-down-0'],
  error_no_metadata: 'ch-no-meta',
  error_no_metadata_for_layer: 'ch-no-meta-layer',
  default: 'ch-default'
};

export const PROFILE_CHOROPLETH_CLASSES = ['ch-red-0', 'ch-red-1', 'ch-red-2', 'ch-red-3', 'ch-red-4'];

export const NODE_SELECTION_LINKS_NUM_COLORS = 10;
export const SANKEY_TRANSITION_TIME = 1000;

// TODO Things that are hardcoded and shouldn't
export const CONTEXT_WITHOUT_MAP_IDS = [3, 4, 5, 6];
export const CONTEXT_WITH_CONTEXT_LAYERS_IDS = [1];

export const APP_DEFAULT_STATE = {
  app: {
    modal: {
      visibility: false,
      modalParams: null
    }
  }
};

export const TOOL_DEFAULT_STATE = {
  tool: {
    selectedNodesIds: [],
    expandedNodesIds: [],
    areNodesExpanded: false,
    detailedView: false,
    selectedNodesData: [],
    selectedMapContextualLayers: null,
    isMapVisible: false,
    expandedMapSidebarGroupsIds: []
  }
};

export const DATA_DEFAULT_STATE = {
  data: {}
};


// fact sheets
export const ACTORS_TOP_SOURCES_SWITCHERS_BLACKLIST = ['included_years', 'buckets'];
export const LINE_LABEL_HEIGHT = 12;

// map
export const CARTO_BASE_URL = 'https://p2cs-sei.carto.com/api/v1/map/';
export const CARTO_NAMED_MAPS_BASE_URL = 'https://p2cs-sei.carto.com/api/v1/map/named/';
export const YEARS_DISABLED_WARNINGS = {
  NO_AGGR_REASON: 'can\'t be displayed over multiple years.',
  NO_AGGR_INSTRUCTION: 'Please modify year selection to a single year.',
  UNAVAILABLE_REASON: 'can\'t be displayed for the selected years.',
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
  basemapLabels: 'basemapLabels'
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
    url: 'https://api.mapbox.com/styles/v1/trasebase/cizi55y2r00122rl65a97ppz1/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidHJhc2ViYXNlIiwiYSI6ImNpemk1NWdhOTAwMmYyeGw5dXRncHpvZGEifQ.fQ6F9DSqmhLXZs-nKiYvzA',
    labelsUrl: 'https://api.mapbox.com/styles/v1/trasebase/cj8086t6u7ias2sjs820bkw7w/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidHJhc2ViYXNlIiwiYSI6ImNpemk1NWdhOTAwMmYyeGw5dXRncHpvZGEifQ.fQ6F9DSqmhLXZs-nKiYvzA',
    attribution: '<span>&copy;</span> <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <span>&copy;</span> <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
    thumbnail: 'images/maps/thumb-basemap-default.png'
  },
  satellite: {
    title: 'Satellite',
    url: 'https://api.mapbox.com/styles/v1/trasebase/cj808lpze6d6o2st3yim6eedl/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidHJhc2ViYXNlIiwiYSI6ImNpemk1NWdhOTAwMmYyeGw5dXRncHpvZGEifQ.fQ6F9DSqmhLXZs-nKiYvzA',
    labelsUrl: 'https://api.mapbox.com/styles/v1/trasebase/cj8ydw4b1ao4q2slhzdmz0izw/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidHJhc2ViYXNlIiwiYSI6ImNpemk1NWdhOTAwMmYyeGw5dXRncHpvZGEifQ.fQ6F9DSqmhLXZs-nKiYvzA',
    attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a>, <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, <a href="https://www.digitalglobe.com/" target="_blank">DigitalGlobe</a>',
    thumbnail: 'images/maps/thumb-basemap-satellite.jpeg',
    dark: true
  },
  topo: {
    title: 'Topography',
    url: '//{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy;<a href="http://opentopomap.org">opentopomap.org</a>',
    thumbnail: 'images/maps/thumb-basemap-topo.png'
  },
  streets: {
    title: 'Streets (OSM)',
    url: '//{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
    thumbnail: 'images/maps/thumb-basemap-streets.png'
  },
};

export const CONTEXT_LAYERS = [
  {
    id: 'landcover',
    title: 'Land cover',
    rasterURL: 'https://s3-eu-west-1.amazonaws.com/lulc/landcover_brazil_2015/',
    legend: '<div class="cartodb-legend custom"><ul class="bullets"><li><div class="bullet" style="background:#008156"></div>Forest</li><li><div class="bullet" style="background:#556B2F"></div>Forest plantations</li><li><div class="bullet" style="background:#E1E196"></div>Pastures</li><li><div class="bullet" style="background:#E1A500"></div>Agriculture</li><li><div class="bullet" style="background:#00FFFF"></div>Coastal forest</li><li><div class="bullet" style="background:#00AFFF"></div>Water</li><li><div class="bullet" style="background:#F5F5F3"></div>Other vegetation</li><li><div class="bullet" style="background:#3E3F40"></div>Not observed</li></ul></div>',
  }, {
    id: 'brazil_biomes',
    title: 'Brazil biomes',
    legend: ''
  }, {
    id: 'brazil_states',
    title: 'Brazil states',
    legend: ''
  }, {
    id: 'water_scarcity',
    title: 'Water scarcity',
    legend: '<div class="cartodb-legend choropleth"><ul class="bullets"><li><div class="bullet" style="background:#4575b4"><span>LESS</span></div><div class="bullet" style="background:#91bfdb"></div><div class="bullet" style="background:#e0f3f8"></div><div class="bullet" style="background:#ffffbf"></div><div class="bullet" style="background:#fee090"></div><div class="bullet" style="background:#fc8d59"></div><div class="bullet" style="background:#d73027"><span>MORE</span></div>Water scarcity</li></ul></div>'
  }, {
    id: 'indigenous_areas',
    title: 'Indigenous areas',
    legend: '<div class=\'cartodb-legend custom\'> <ul class="bullets"><li class="bkg"><div class="bullet" style="background-color:#ECC35F"></div>Indigenous areas</li></ul></div>'
  }, {
    id: 'brazil_protected',
    title: 'Brazil protected areas',
    legend: '<div class=\'cartodb-legend custom\'> <ul class="bullets"><li class="bkg"><div class="bullet" style="background-color:#B4D84F"></div>Protected areas</li></ul></div>'
  }, {
    id: 'brazil_defor_alerts',
    title: 'Deforestation polygons',
    legend: '<div class=\'cartodb-legend custom\'><ul class="bullets"><li><div class= "bullet" style= "background:#850200"></div>Deforestation</li></ul></div>'
  }
];

export const DEFAULT_BASEMAP_FOR_CHOROPLETH = 'default';
