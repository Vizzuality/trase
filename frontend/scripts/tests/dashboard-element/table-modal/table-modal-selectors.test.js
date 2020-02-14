import nodesPanelInitialState from 'react-components/nodes-panel/nodes-panel.initial-state';
import { getTableHeaders } from 'react-components/shared/table-modal/table-modal.selectors';
import { meta, data } from './table-modal-mocks';

describe('Table widget selectors', () => {
  describe('getTableHeaders', () => {
    const state = {
      nodesPanel: {
        ...nodesPanelInitialState,
        countries: {
          ...nodesPanelInitialState.countries,
          data: {
            byId: [0],
            nodes: { 0: { id: 0, name: 'Country Name' } }
          },
          selectedNodeId: 0
        },
        commodities: {
          ...nodesPanelInitialState.commodities,
          data: {
            byId: [0],
            nodes: { 0: { id: 0, name: 'Commodity Name' } }
          },
          selectedNodeId: 0
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
      ).toEqual([
        { name: 'country' },
        { name: 'commodity' },
        { name: 'year' },
        { name: 'biome' },
        { name: 'trade volume', unit: 't', format: ',.2s' }
      ]);
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
        { name: 'country' },
        { name: 'commodity' },
        { name: 'year' },
        { name: 'trade volume', unit: 't', format: ',.2s' },
        { name: 'zero deforestation commitment (exporter)' }
      ]);
    });
    // Multiple years, non-cont indicator, 1 source, no other flow path filters
    it.skip('returns the headings for Stacked bar chart per year per value of non-continuous indicator - globally', () => {
      const chartType = 'stackedBar';
      const { mYearNCont } = meta;
      const oneSourceState = {
        ...state,
        sources: {
          activeItems: { 0: { name: 'Biome Name' } }
        }
      };

      expect(
        getTableHeaders(oneSourceState, {
          meta: mYearNCont,
          data,
          chartType
        })
      ).toEqual([
        { name: 'commodity' },
        { name: 'country' },
        { name: 'year' },
        { name: 'biome' },
        { name: 'trade volume', unit: 't', format: ',.2s' },
        { name: 'zero deforestation commitment (exporter)' }
      ]);
    });
  });
});
