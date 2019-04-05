import { getTableHeaders } from 'react-components/dashboard-element/dashboard-widget/table-modal/table-modal.selectors';
import { meta, data } from './table-modal-mocks';

describe('Table widget selectors', () => {
  describe('getTableHeaders', () => {
    const state = {
      dashboardElement: {
        countriesPanel: {
          activeItems: [{ name: 'Country Name' }]
        },
        commoditiesPanel: {
          activeItems: [{ name: 'Commodity Name' }]
        }
      }
    };
    // Single year, no non-cont indicator, no flow path filters
    it('returns the headings to Bar chart per biome', () => {
      const { sYear } = meta;
      const chartType = 'horizontalBar';
      expect(
        getTableHeaders(state, {
          meta: sYear,
          data,
          chartType
        })
      ).toEqual(['COMMODITY', 'COUNTRY', 'YEAR', 'BIOME', 'TRADE VOLUME (t)']);
    });
    // Multiple years, non-cont indicator, no flow path filters
    it('returns the headings for Stacked bar chart per year per value of non-continuous indicator - globally', () => {
      const chartType = 'stackedBar';
      const { mYearNCont } = meta;
      expect(
        getTableHeaders(state, {
          meta: mYearNCont,
          data,
          chartType
        })
      ).toEqual([
        'COMMODITY',
        'COUNTRY',
        'YEAR',
        'TRADE VOLUME (t)',
        'ZERO DEFORESTATION COMMITMENT (EXPORTER)'
      ]);
    });
    // Multiple years, non-cont indicator, 1 source, no other flow path filters
    xit('returns the headings for Stacked bar chart per year per value of non-continuous indicator - globally', () => {
      const chartType = 'stackedBar';
      const { mYearNCont } = meta;
      expect(
        getTableHeaders(state, {
          meta: mYearNCont,
          data,
          chartType
        })
      ).toEqual([
        'COMMODITY',
        'COUNTRY',
        'YEAR',
        'TRADE VOLUME (t)',
        'BIOMES',
        'ZERO DEFORESTATION COMMITMENT (EXPORTER)'
      ]);
    });
  });
});
