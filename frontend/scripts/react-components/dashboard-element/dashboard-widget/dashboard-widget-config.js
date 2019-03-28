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
      'soy-moratorium': '#1D6837',
      none: '#e36845'
    }
  },
  stars: {
    'red-blue': ['#000', '#E54935', '#FFC389', '#FFFECC', '#E5F5F9', '#79A8D0']
  },
  linear: {
    'red-blue': [
      '#246AB6',
      '#5488C0',
      '#9FCAE1',
      '#E5F5F9',
      '#FFFECC',
      '#FFE6A4',
      '#FFA16F',
      '#E54935'
    ],
    'yellow-green': ['#000', '#ffc', '#c2e699', '#78c679', '#31a354', '#006837']
  },
  percentual: {
    'yellow-green': ['#000', '#ffc', '#c2e699', '#78c679', '#31a354', '#006837'],
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
        interval: 'preserveStartEnd'
      }
    },
    yAxis: {
      ...defaults.yAxis,
      interval: 0
    }
  },
  horizontalStackedBarChart: {
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
        stackId: 'bar'
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
    }
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
    type: 'sentence'
  }
};
