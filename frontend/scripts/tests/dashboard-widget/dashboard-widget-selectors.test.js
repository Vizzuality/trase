import initialState from 'react-components/dashboard-element/dashboard-element.initial-state';
import {
  getDefaultConfig,
  getYKeys,
  getColors,
  makeGetConfig
} from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.selectors';
import CHART_CONFIG from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-config';

const country = {
  id: 27,
  name: 'BRAZIL'
};

const commodity = {
  id: 1,
  name: 'SOY'
};

const recolorByZeroDeforestationCommitment = {
  label: 'Zero Deforestation Commitment (Exporter)',
  legendColorTheme: 'thematic',
  legendType: 'qual',
  type: 'qual',
  attributeId: 1
};

const defaultState = {
  app: {
    contexts: [
      {
        id: 1,
        isDefault: true,
        defaultYear: 2017,
        countryId: 27,
        countryName: 'BRAZIL',
        commodityId: 1,
        commodityName: 'SOY',
        recolorBy: [recolorByZeroDeforestationCommitment]
      }
    ]
  },
  dashboardElement: {
    ...initialState,
    data: {
      ...initialState.data,
      countries: [country],
      commodities: [commodity]
    },
    selectedCountryId: country.id,
    selectedCommodityId: commodity.id
  }
};

const zdcRecolorByState = {
  ...defaultState,
  dashboardElement: {
    ...defaultState.dashboardElement,
    selectedRecolorBy: 1
  }
};

const mockChart = {
  data: [
    { x0: 2878667.2818, x1: 6737450.485456, x2: 55881.97, y: 'UNKNOWN' },
    { x0: 1862471.609, x1: 2418489.809, x2: null, y: 'PORTO ALEGRE' },
    { x0: 1936067.420415, x1: 2337310.303489, x2: null, y: 'RIO GRANDE' },
    { x0: 706986.672885, x1: 2753581.664694, x2: null, y: 'PONTA GROSSA' },
    { x0: 1270885.4496128, x1: 1303329.81637494, x2: 532107.517956253, y: 'RONDONOPOLIS' },
    { x0: 268144.767, x1: 2393157.53328057, x2: 235020.481696427, y: 'RIO VERDE' },
    { x0: 283261.165, x1: 2055996.338106, x2: 532579.668, y: 'SORRISO' },
    { x0: 1435726.205, x1: 858884.387000001, x2: null, y: 'MARINGA' },
    { x0: null, x1: 2057143.843164, x2: null, y: 'CAMPO MOURAO' },
    { x0: null, x1: 1955274.678, x2: null, y: 'PALMEIRA' },
    { x0: 10159983.7617738, x1: 14592178.0078618, x2: 7494946.66825236, y: 'OTHER' }
  ],
  meta: {
    info: { years: { start_year: 2012, end_year: 2015 } },
    yAxis: { type: 'category', label: 'LOGISTICS HUB', prefix: '', format: '', suffix: '' },
    xAxis: { type: 'number', label: 'Trade volume', prefix: '', format: '', suffix: 't' },
    y: { label: 'LOGISTICS HUB', tooltip: { prefix: '', format: '', suffix: '' } },
    x0: { label: 'Company commitment', tooltip: { prefix: '', format: '', suffix: '' } },
    x1: { label: 'None', tooltip: { prefix: '', format: '', suffix: '' } },
    x2: { label: 'Soy Moratorium', tooltip: { prefix: '', format: '', suffix: '' } }
  }
};

const notSelectedRecolorBy = { value: null, name: 'none' };

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
      expect(
        getYKeys(defaultState, { meta: null, selectedRecolorBy: null, chartType: 'bar_chart' })
      ).toMatchSnapshot();
    });
    it('returns the parsed YKeys', () => {
      expect(
        getYKeys(defaultState, {
          meta: mockChart.meta,
          selectedRecolorBy: notSelectedRecolorBy,
          chartType: 'bar_chart'
        })
      ).toMatchSnapshot();
    });
    it('returns the default yKeys when parsing horizontal charts', () => {
      expect(
        getYKeys(defaultState, {
          meta: mockChart.meta,
          selectedRecolorBy: notSelectedRecolorBy,
          chartType: 'horizontal_bar_chart'
        })
      ).toMatchSnapshot();
    });
  });

  describe('getColors', () => {
    it('return the colors using the default ramp', () => {
      expect(
        getColors(defaultState, { meta: null, chartType: 'bar_chart', selectedRecolorBy: null })
      ).toMatchSnapshot();
    });

    it('return the colors using the default ramp when chart type is sentence', () => {
      expect(
        getColors(defaultState, {
          meta: null,
          chartType: 'dynamic_sentence',
          selectedRecolorBy: null
        })
      ).toMatchSnapshot();
    });

    it('returns the pie legend colors if the chartType is pie', () => {
      const pie = {
        data: [
          { x: 'Company commitment', y0: 20802194.3324866 },
          { x: 'None', y0: 39462796.8664263 },
          { x: 'Soy Moratorium', y0: 8850536.30590504 }
        ],
        meta: {
          xAxis: {
            type: 'category',
            label: 'Zero Deforestation Commitment (Exporter)',
            prefix: '',
            format: '',
            suffix: null
          },
          yAxis: { type: 'number', label: 'Trade volume', prefix: '', format: '', suffix: 't' },
          x: {
            label: 'Zero Deforestation Commitment (Exporter)',
            tooltip: { prefix: '', format: '', suffix: null }
          },
          y0: { label: 'Trade volume', tooltip: { prefix: '', format: '', suffix: 't' } }
        }
      };

      expect(
        getColors(zdcRecolorByState, {
          data: pie.data,
          meta: pie.meta,
          chartType: 'donut_chart',
          selectedRecolorBy: recolorByZeroDeforestationCommitment
        })
      ).toMatchSnapshot();
    });

    it('returns the zero deforestation commitment colors', () => {
      expect(
        getColors(zdcRecolorByState, {
          meta: mockChart.meta,
          chartType: 'horizontal_bar_chart',
          selectedRecolorBy: recolorByZeroDeforestationCommitment
        })
      ).toMatchSnapshot();
    });
  });

  // makeGetConfig is a function that returns the selector just to be able to memoize the selector result
  describe('makeGetConfig', () => {
    it('returns the defaultConfig if there is no meta', () => {
      expect(makeGetConfig()(defaultState, { meta: null, selectedRecolorBy: null })).toEqual(
        CHART_CONFIG.bar
      );
    });

    it('Parses the config with recolor by', () => {
      expect(
        makeGetConfig()(zdcRecolorByState, {
          data: mockChart.data,
          meta: mockChart.meta,
          chartType: 'horizontal_bar_chart',
          selectedRecolorBy: recolorByZeroDeforestationCommitment
        })
      ).toMatchSnapshot();
    });

    it('Parses the config without recolor by', () => {
      expect(
        makeGetConfig()(defaultState, {
          data: mockChart.data,
          meta: mockChart.meta,
          chartType: 'horizontal_bar_chart',
          selectedRecolorBy: notSelectedRecolorBy
        })
      ).toMatchSnapshot();
    });
  });
});
