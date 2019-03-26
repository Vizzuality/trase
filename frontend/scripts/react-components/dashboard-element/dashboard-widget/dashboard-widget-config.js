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
    opacity: 0.5,
    stroke: '#9a1e2a',
    strokeWidth: 2
  },
  content: null
};

const defaults = {
  xAxis,
  yAxis,
  tooltip,
  cartesianGrid
};

export default {
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  bar: {
    ...defaults,
    tooltip: {
      cursor: {
        opacity: 0
      }
    },
    type: 'bar',
    colors: ['#ee5463'],
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
    colors: ['#fff0c2', '#9a1e2a', '#ee5463', '#c62c3b', '#fd7d8a'],
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
    tooltip: {
      cursor: {
        opacity: 0
      }
    },
    type: 'bar',
    layout: 'vertical',
    colors: ['#ee5463'],
    xKeys: {
      bars: null
    },
    yKey: 'y',
    xKeysAttributes: {
      bars: {
        interval: 'preserveStartEnd'
      }
    }
  },
  pie: {
    ...defaults,
    type: 'pie',
    colors: ['#fff0c2', '#9a1e2a', '#ee5463', '#c62c3b', '#fd7d8a', '#ffb1b9', '#ffffff'],
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
    type: 'line',
    colors: ['#fff0c2', '#ee5463', '#fd7d8a'],
    xKey: 'x',
    yKeys: {
      lines: null
    }
  },
  dynamicSentence: {
    type: 'sentence'
  }
};
