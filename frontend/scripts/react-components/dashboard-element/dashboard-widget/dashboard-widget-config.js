export default {
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  bar: {
    xKey: 'x',
    yKeys: {
      bars: {
        y: {
          stroke: '#ee5463',
          fill: '#ee5463',
          interval: 'preserveStartEnd',
          stackId: 'type'
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
