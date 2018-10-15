export default {
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  bar: {
    xKey: 'x',
    yKeys: {
      bars: {
        y: {
          stroke: '#ee5463',
          fill: '#ee5463',
          interval: 'preserveStartEnd'
        }
      }
    },
    xAxis: {
      type: 'category',
      tickLine: false,
      interval: 'preserveStartEnd',
      tick: {
        fontFamily: 'DecimaMonoPro',
        fontSize: 14,
        fill: '#ffffff'
      },
      axisLine: false
    },
    yAxis: {
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
    },
    cartesianGrid: {
      vertical: false,
      strokeDasharray: '5 5'
    }
  },
  stackedBar: {
    xKey: 'x',
    yKeys: {
      bars: {
        liquids: {
          stroke: '#fff0c2',
          fill: '#fff0c2',
          stackId: 'x',
          interval: 'preserveStartEnd'
        },
        natural_gas: {
          stroke: '#9a1e2a',
          fill: '#9a1e2a',
          stackId: 'x',
          interval: 'preserveStartEnd'
        },
        coal: {
          stroke: '#ee5463',
          fill: '#ee5463',
          stackId: 'x',
          interval: 'preserveStartEnd'
        },
        nuclear: {
          stroke: '#c62c3b',
          fill: '#c62c3b',
          stackId: 'x',
          interval: 'preserveStartEnd'
        },
        renewables: {
          stroke: '#fd7d8a',
          fill: '#fd7d8a',
          stackId: 'x',
          interval: 'preserveStartEnd'
        }
      }
    },
    xAxis: {
      type: 'category',
      tickLine: false,
      interval: 'preserveStartEnd',
      tick: {
        fontFamily: 'DecimaMonoPro',
        fontSize: 14,
        fill: '#ffffff'
      },
      axisLine: false
    },
    yAxis: {
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
    },
    cartesianGrid: {
      vertical: false,
      strokeDasharray: '5 5'
    }
  },
  pie: {
    type: 'pie',
    xKey: 'x',
    yKeys: {
      pies: {
        y: {
          cx: '40%',
          cy: '50%',
          nameKey: 'x',
          innerRadius: '60%',
          outerRadius: '80%'
        }
      }
    },
  }
};
