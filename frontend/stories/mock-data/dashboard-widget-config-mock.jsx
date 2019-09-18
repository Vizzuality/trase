import React from 'react';
import CHART_CONFIG from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-config';
import DashboardWidgetTooltip from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-tooltip';
import { format } from 'd3-format';

export const meta = {
  xAxis: {
    label: 'Year',
    prefix: '',
    format: '',
    suffix: ''
  },
  yAxis: {
    label: 'Trade volume',
    prefix: '',
    format: '',
    suffix: 't'
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
    label: 'Trade Volume',
    tooltip: {
      prefix: '',
      format: '',
      suffix: ''
    }
  },
  y2: {
    type: 'number',
    label: 'Production of Soy',
    tooltip: {
      prefix: '',
      format: '',
      suffix: ''
    }
  },
  x0: {
    label: 'Trade Volume',
    tooltip: {
      prefix: '',
      format: '',
      suffix: 't'
    }
  },
  x1: {
    label: 'Trade Volume',
    tooltip: {
      prefix: '',
      format: '',
      suffix: 't'
    }
  },
  x2: {
    label: 'Production of Soy',
    tooltip: {
      prefix: '',
      format: '',
      suffix: 't'
    }
  },
  info: {
    node_type: null,
    years: {
      start_year: 2017,
      end_year: null
    },
    top_n: null,
    filter: {
      cont_attribute: 'Trade volume',
      ncont_attribute: null,
      sources: [],
      companies: [],
      destinations: []
    },
    single_filter_key: null
  },
  aggregates: { total_value: { x0: 100 } },
  yLabelsProfileInfo: [
    { profile: 'actor' },
    { profile: 'actor' },
    { profile: 'actor' },
    { profile: 'actor' },
    { profile: 'actor' },
    { profile: 'actor' },
    { profile: 'actor' },
    { profile: 'actor' },
    { profile: 'actor' },
    { profile: 'actor' },
    { profile: 'actor' }
  ]
};

const tooltip = {
  ...CHART_CONFIG.tooltip,
  content: <DashboardWidgetTooltip meta={meta} />
};

const color = [{ label: 'Production of soy', color: '#ee5463' }];

const colors = [
  { label: 'Trade volume', color: '#fff0c2' },
  { label: 'Production of soy', color: '#ee5463' }
];

const barConfig = {
  ...CHART_CONFIG.bar,
  tooltip,
  colors,
  type: 'bar',
  yKeys: {
    bars: {
      y1: { fill: '#fff0c2', stroke: '#fff0c2', interval: 'preserveStartEnd' },
      y2: { fill: '#ee5463', stroke: '#ee5463', interval: 'preserveStartEnd' }
    }
  },
  yAxisLabel: { text: 'Label', suffix: 't' }
};

export default {
  bar: barConfig,
  line: {
    ...CHART_CONFIG.line,
    tooltip: {
      ...tooltip,
      cursor: {
        opacity: 0.5,
        stroke: '#9a1e2a',
        strokeWidth: 2
      }
    },
    colors,
    yKeys: {
      lines: {
        y1: { fill: '#fff0c2', stroke: '#fff0c2' },
        y2: { fill: '#ee5463', stroke: '#ee5463' }
      }
    },
    yAxisLabel: { text: 'Label', suffix: 't' }
  },
  stackedBar: {
    ...barConfig,
    type: 'bar',
    yKeys: {
      bars: {
        y1: { fill: '#fff0c2', stroke: '#fff0c2', interval: 'preserveStartEnd', stackId: 'bar' },
        y2: { fill: '#fd7d8a', stroke: '#fd7d8a', interval: 'preserveStartEnd', stackId: 'bar' }
      }
    }
  },
  horizontalBar: {
    ...CHART_CONFIG.horizontalBar,
    dashboardMeta: {
      context: { id: 1 }
    },
    colors: color,
    tooltip,
    type: 'bar',
    xKeys: {
      bars: {
        x1: { fill: '#fd7d8a', stroke: '#fd7d8a', interval: 'preserveStartEnd' }
      }
    },
    unit: 't',
    unitFormat: value => format('.2s')(value),
    yAxisLabel: {
      text: 'Exporter Companies'
    },
    margin: { left: 120 },
    xAxis: {
      ...CHART_CONFIG.horizontalBar.xAxis,
      type: 'number'
    },
    yAxis: {
      ...CHART_CONFIG.horizontalBar.yAxis,
      type: 'category'
    }
  },
  horizontalStackedBar: {
    ...CHART_CONFIG.horizontalBar,
    dashboardMeta: {
      context: { id: 1 }
    },
    colors,
    tooltip,
    type: 'bar',
    xKeys: {
      bars: {
        x1: {
          fill: '#fff0c2',
          stroke: '#fff0c2',
          interval: 'preserveStartEnd',
          stackId: 'bar',
          nameKey: 'x'
        },
        x2: {
          fill: '#fd7d8a',
          stroke: '#fd7d8a',
          interval: 'preserveStartEnd',
          stackId: 'bar',
          nameKey: 'x'
        }
      }
    },
    margin: { left: 120 },
    unit: 't',
    unitFormat: value => format('.2s')(value),
    yAxisLabel: {
      text: 'Exporter Companies'
    },
    xAxis: {
      ...CHART_CONFIG.horizontalBar.xAxis,
      type: 'number'
    },
    yAxis: {
      ...CHART_CONFIG.horizontalBar.yAxis,
      type: 'category'
    }
  },
  pie: {
    ...CHART_CONFIG.pie,
    tooltip,
    colors,
    type: 'pie',
    yKeys: {
      pies: {
        y1: {
          nameKey: 'x',
          innerRadius: '60%',
          outerRadius: '80%'
        }
      }
    }
  },
  dynamicSentence: {
    type: 'sentence',
    yAxisLabel: { text: 'Trade volume', suffix: 't' }
  },
  ranking: {
    type: 'ranking',
    yAxisLabel: { text: 'Trade volume', suffix: 't' }
  }
};
