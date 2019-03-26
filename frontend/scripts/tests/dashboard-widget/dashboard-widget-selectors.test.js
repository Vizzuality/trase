import {
  getDefaultConfig,
  getYKeys,
  getColors,
  makeGetConfig
} from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.selectors';
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

describe('Widget config parse selectors', () => {
  describe('getDefaultConfig', () => {
    it('returns the default bar config if the chartType is not found', () => {
      expect(getDefaultConfig(null, { chartType: 'notFoundChartype' })).toEqual(CHART_CONFIG.bar);
    });
    it('returns the default chart config of a specific chart', () => {
      expect(getDefaultConfig(null, { chartType: 'donut_chart' })).toEqual(CHART_CONFIG.pie);
    });
  });

  describe('getYKeys', () => {
    it('returns the default YKeys if there is no meta', () => {
      expect(getYKeys(null, { meta: null })).toMatchSnapshot();
    });
    it('returns the parsed YKeys', () => {
      expect(getYKeys(null, { meta })).toMatchSnapshot();
    });
  });

  describe('getColors', () => {
    it('returns the defaultConfig colors if there is no meta', () => {
      expect(getColors(null, { meta: null, chartType: 'bar_chart' })).toEqual(
        CHART_CONFIG.bar.colors
      );
    });

    it('returns the pie colors if the chartType is pie', () => {
      const pieData = [
        {
          y1: 100,
          x: 1,
          color: '#fff0c2'
        },
        {
          y1: 200,
          x: 2,
          color: '#9a1e2a'
        }
      ];
      expect(getColors(null, { data: pieData, meta, chartType: 'donut_chart' })).toMatchSnapshot();
    });
    it('returns the colors if the chartType is not pie', () => {
      const data = [
        {
          x: 2003,
          y1: 51919439.9942143
        }
      ];
      expect(getColors(null, { data, meta })).toMatchSnapshot();
    });
  });

  // makeGetConfig is a function that returns the selector just to be able to memoize the selector result
  describe('makeGetConfig', () => {
    it('returns the defaultConfig if there is no meta', () => {
      expect(makeGetConfig()(null, { meta: null })).toEqual(CHART_CONFIG.bar);
    });

    it('Parses the config', () => {
      expect(makeGetConfig()(null, { meta, chartType: 'bar_chart' })).toMatchSnapshot();
    });
  });
});
