import translateLink from 'utils/translate-link';

const cardLink = {
  id: 5,
  queryParams: {
    toolLayout: '1',
    selectedContextId: '5',
    selectedNodesIds: [
      '13430',
      '13406',
      '13460',
      '13417',
      '13404',
      '13392',
      '13408',
      '13410',
      '13419',
      '13486'
    ],
    mapView: '-1.51,111.93,4',
    expandedNodesIds: [
      '13430',
      '13406',
      '13460',
      '13417',
      '13404',
      '13392',
      '13408',
      '13410',
      '13419',
      '13486'
    ],
    selectedCountryId: 107,
    selectedCommodityId: 6,
    selectedResizeBy: 37,
    selectedColumnsIds: '0_15-1_6-2_7-3_8'
  },
  title: 'Top exporters',
  subtitle: '',
  countryId: 107,
  commodityId: 6,
  commodityName: 'CRUDE PALM OIL',
  countryName: 'INDONESIA'
};

const meta = {
  nodes: [
    { id: 13430, nodeTypeId: 6 },
    { id: 13406, nodeTypeId: 15 },
    { id: 13460, nodeTypeId: 6 },
    { id: 13417, nodeTypeId: 7 },
    { id: 13404, nodeTypeId: 6 },
    { id: 13392, nodeTypeId: 6 },
    { id: 13408, nodeTypeId: 6 },
    { id: 13410, nodeTypeId: 6 },
    { id: 13419, nodeTypeId: 6 },
    { id: 13486, nodeTypeId: 8 }
  ],
  columns: {
    '15': { columnGroup: 0, nodeTypeId: 15, nodeType: 'PORT OF EXPORT', role: 'source' },
    '6': { columnGroup: 1, nodeTypeId: 6, nodeType: 'EXPORTER', role: 'exporter' },
    '7': { columnGroup: 2, nodeTypeId: 7, nodeType: 'IMPORTER', role: 'importer' },
    '8': { columnGroup: 3, nodeTypeId: 8, nodeType: 'COUNTRY', role: 'destination' }
  }
};

describe('translate links', () => {
  test('get sankey link using translateLink', () => {
    expect(translateLink(cardLink, meta)).toEqual({
      type: 'tool',
      payload: {
        serializerParams: {
          ...cardLink.queryParams,
          toolLayout: parseInt(cardLink.queryParams.toolLayout, 10),
          selectedContextId: parseInt(cardLink.queryParams.selectedContextId, 10),
          selectedNodesIds: cardLink.queryParams.selectedNodesIds.map(id => parseInt(id, 10)),
          expandedNodesIds: cardLink.queryParams.expandedNodesIds.map(id => parseInt(id, 10)),
          countries: 107,
          commodities: 6,
          sources: [13406],
          destinations: [13486],
          companies: [13430, 13460, 13417, 13404, 13392, 13408, 13410, 13419]
        }
      }
    });
  });

  test('get dashboard link using translateLink', () => {
    expect(translateLink(cardLink, meta, 'dashboard')).toEqual({
      type: 'dashboardElement',
      payload: {
        dashboardId: 'top-exporters',
        serializerParams: {
          selectedResizeBy: 37,
          countries: 107,
          commodities: 6,
          sources: [13406],
          destinations: [13486],
          companies: [13430, 13460, 13417, 13404, 13392, 13408, 13410, 13419]
        }
      }
    });
  });
});
