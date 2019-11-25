import colors from 'styles/_settings.scss';

const variantFill = {
  dark: '#ffffff',
  light: '#34444c'
};

const getXAxis = variant => ({
  tickLine: false,
  interval: 'preserveStartEnd',
  tick: {
    fontFamily: 'DecimaMonoPro',
    fontSize: 14,
    fill: variantFill[variant]
  },
  axisLine: false
});

const getYAxis = variant => ({
  axisLine: false,
  tick: {
    fontFamily: 'DecimaMonoPro',
    tickCount: 2,
    interval: 2,
    fontSize: 14,
    fill: variantFill[variant]
  },
  tickFormatter: t => t.toLocaleString(),
  domain: [0, 'auto']
});

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


const getDefaults = variant => ({
  parse: true,
  xAxis: getXAxis(variant),
  yAxis: getYAxis(variant),
  colors,
  tooltip,
  cartesianGrid
});

export const getChartConfig = (variant = 'dark') => {
  const defaults = getDefaults(variant);
  return {
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    bar: {
      ...getDefaults(variant),
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
};

export default getChartConfig();
