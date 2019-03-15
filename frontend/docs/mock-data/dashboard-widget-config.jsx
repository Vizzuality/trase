import React from 'react';
import CHART_CONFIG from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-config';
import DashboardWidgetTooltip from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-tooltip';

const meta = {
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
    label: '',
    tooltip: {
      prefix: '',
      format: '',
      suffix: ''
    }
  }
};

const tooltip = {
  ...CHART_CONFIG.tooltip,
  content: <DashboardWidgetTooltip meta={meta} />
};

export default {
  line: {
    ...CHART_CONFIG.line,
    tooltip,
    colors: [
      {
        label: 'y1',
        color: '#fff'
      }
    ],
    yKeys: { lines: { y1: { fill: '#fff0c2', stroke: '#fff0c2' } } },
    yAxisLabel: { text: 'y1', suffix: 't' }
  },
  bar: {
    ...CHART_CONFIG.bar,
    tooltip,
    type: 'bar',
    colors: ['#ee5463'],
    yKeys: {
      bars: { y1: { fill: '#fff0c2', stroke: '#fff0c2' } }
    }
  },
  stackedBar: {
    ...CHART_CONFIG.stackedBar,
    tooltip,
    type: 'bar',
    colors: [
      { color: '#fff0c2' },
      { color: '#9a1e2a' },
      { color: '#ee5463' },
      { color: '#c62c3b' },
      { color: '#fd7d8a' }
    ],
    yKeys: {
      bars: {
        y1: { fill: '#fff0c2', stroke: '#fff0c2' },
        y2: { fill: '#fd7d8a', stroke: '#fd7d8a' }
      }
    }
  },
  pie: {
    ...CHART_CONFIG.pie,
    tooltip,
    colors: ['#fff0c2', '#9a1e2a', '#ee5463', '#c62c3b', '#fd7d8a'],
    type: 'pie',
    yKeys: {
      pies: { y1: { fill: '#fff0c2', stroke: '#fff0c2' } }
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
  }
};
