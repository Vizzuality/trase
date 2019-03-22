import CHART_CONFIG from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-config';

export const meta = {
  xAxis: {
    label: 'Year',
    prefix: '',
    format: '',
    suffix: ''
  },
  yAxis: {
    label: 'Water scarcity',
    prefix: '',
    format: '',
    suffix: '/7'
  },
  x: {
    type: 'category',
    label: 'Year',
    tooltip: {
      prefix: '',
      format: '',
      suffix: ''
    }
  },
  y1: {
    type: 'number',
    label: '',
    tooltip: {
      prefix: '',
      format: '',
      suffix: ''
    }
  }
};

const firstColor = CHART_CONFIG.line.colors[0];

export const yKeys = {
  lines: {
    y1: {
      fill: firstColor,
      stroke: firstColor
    }
  }
};

export const colors = [
  {
    label: 'Water scarcity',
    color: firstColor
  }
];

export const parsedConfig = {
  type: 'line',
  xAxis: {
    tickLine: false,
    interval: 'preserveStartEnd',
    tick: {
      fontFamily: 'DecimaMonoPro',
      fontSize: 14,
      fill: '#ffffff'
    },
    axisLine: false,
    type: 'category'
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
    domain: [0, 'auto'],
    type: undefined, // default is number
    tickFormatter: CHART_CONFIG.line.yAxis.tickFormatter
  },
  tooltip: {
    cursor: {
      opacity: 0.5,
      stroke: '#9a1e2a',
      strokeWidth: 2
    },
    content: null
  },
  cartesianGrid: {
    vertical: false,
    strokeDasharray: '5 5'
  },
  colors: [
    {
      label: 'Water scarcity',
      color: firstColor
    }
  ],
  xKey: 'x',
  yKeys: {
    lines: {
      y1: {
        fill: firstColor,
        stroke: firstColor
      }
    }
  },
  yAxisLabel: {
    text: 'Water scarcity',
    suffix: '/7'
  }
};
