const xAxis = {
  tickLine: false,
  interval: 'preserveStartEnd',
  tick: {
    fontFamily: 'DecimaMonoPro',
    fontSize: 14,
    fill: '#ffffff'
  },
  axisLine: false
};

const yAxis = {
  axisLine: false,
  tick: {
    fontFamily: 'DecimaMonoPro',
    tickCount: 2,
    interval: 2,
    fontSize: 14,
    fill: '#ffffff'
  },
  tickFormatter: t => t.toLocaleString(),
  domain: [0, 'auto']
};

const cartesianGrid = {
  vertical: false,
  strokeDasharray: '5 5'
};

const tooltip = {
  cursor: {
    opacity: 0
  },
  content: null
};

const colors = {
  default: [
    '#ea6869',
    '#ffeb8b',
    '#2d586e',
    '#007d29',
    '#b4008a',
    '#06ff67',
    '#8339aa',
    '#ffb700',
    '#fc7839',
    '#67caf1',
    '#e1228c'
  ],
  qual: {
    thematic: {
      amazonia: '#43f3f3',
      cerrado: '#517fee',
      'mata-atlantica': '#8c28ff',
      caatinga: '#ff66e5',
      pampa: '#72ea28',
      pantanal: '#ffb314',
      'chaco-seco': '#ffb314',
      'chaco-humedo': '#43f3f3',
      'company-commitment': '#C2E699',
      'company-ndpe-commitment': '#1D6837',
      'soy-moratorium': '#1D6837',
      tac: '#79ae6d',
      'tac-&-g4': '#1D6837',
      none: '#e36845'
    }
  },
  stars: {
    'red-blue': ['#6F0119', '#a50026', '#D72F27', '#FDAE61', '#79A8D0', '#246AB6']
  },
  linear: {
    'red-blue': [
      '#6F0119',
      '#a50026',
      '#D72F27',
      '#FDAE61',
      '#9FCAE1',
      '#79A8D0',
      '#5488C0',
      '#246AB6'
    ],
    'yellow-green': ['', '#ffc', '#c2e699', '#78c679', '#31a354', '#006837']
  },
  percentual: {
    'yellow-green': ['', '#ffc', '#c2e699', '#78c679', '#31a354', '#006837'],
    'green-red': [
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
    ]
  }
};

const defaults = {
  parse: true,
  xAxis,
  yAxis,
  colors,
  tooltip,
  cartesianGrid
};

export default {
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  bar: {
    ...defaults,
    tooltip,
    type: 'bar',
    xKey: 'x',
    yKeys: {
      bars: null
    },
    yKeysAttributes: {
      bars: {
        interval: 'preserveStartEnd'
      }
    }
  },
  stackedBar: {
    ...defaults,
    type: 'bar',
    xKey: 'x',
    yKeys: {
      bars: null
    },
    yKeysAttributes: {
      bars: {
        stackId: 'bar'
      }
    }
  },
  horizontalBar: {
    ...defaults,
    tooltip,
    type: 'bar',
    layout: 'vertical',
    xKeys: {
      bars: null
    },
    yKey: 'y',
    xKeysAttributes: {
      bars: {
        interval: 'preserveStartEnd',
        barSize: 10
      }
    },
    yAxis: {
      ...defaults.yAxis,
      interval: 0
    }
  },
  horizontalStackedBar: {
    ...defaults,
    tooltip,
    type: 'bar',
    layout: 'vertical',
    yKey: 'y',
    xKeys: {
      bars: null
    },
    xKeysAttributes: {
      bars: {
        stackId: 'bar',
        barSize: 10
      }
    },
    yAxis: {
      ...defaults.yAxis,
      interval: 0
    }
  },
  pie: {
    ...defaults,
    type: 'pie',
    xAxis: undefined,
    yAxis: undefined,
    xKey: 'x',
    yKeys: {
      pies: null
    },
    yKeysAttributes: {
      pies: {
        cx: '40%',
        cy: '50%',
        nameKey: 'x',
        innerRadius: '60%',
        outerRadius: '80%'
      }
    },
    cartesianGrid: null
  },
  line: {
    ...defaults,
    tooltip: {
      cursor: {
        opacity: 0.5,
        stroke: '#9a1e2a',
        strokeWidth: 2
      }
    },
    type: 'line',
    xKey: 'x',
    yKeys: {
      lines: null
    }
  },
  dynamicSentence: {
    type: 'sentence',
    parse: false
  },
  nodeIndicatorSentence: {
    type: 'nodeIndicatorSentence',
    parse: false
  },
  ranking: {
    type: 'ranking',
    parse: false
  }
};
