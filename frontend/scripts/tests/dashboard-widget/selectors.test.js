import { makeGetConfig } from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.selectors';
import CHART_CONFIG from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-config';

const meta = {
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

// makeGetConfig is a function that returns the selector just to be able to memoize the selector result
describe('Widget config parse selectors', () => {
  describe('makeGetConfig', () => {
    it('returns the defaultConfig if there is no meta', () => {
      expect(makeGetConfig()(null, { meta: null })).toEqual(CHART_CONFIG.line);
    });

    it('Parses the config', () => {
      expect(makeGetConfig()(null, { meta, chartType: 'line' })).toMatchSnapshot();
    });
  });
});
