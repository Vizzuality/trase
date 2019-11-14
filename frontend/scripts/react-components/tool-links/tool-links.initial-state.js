// we extract it into a new file to avoid cycles

export default {
  data: {
    columns: null,
    nodes: null,
    links: null,
    nodeHeights: null,
    nodeAttributes: null,
    nodesByColumnGeoId: null
  },
  detailedView: false,
  forcedOverview: false,
  highlightedNodeId: null,
  flowsLoading: false,
  selectedColumnsIds: null,
  extraColumn: null,
  extraColumnNodeId: null,
  selectedNodesIds: [],
  selectedRecolorBy: null,
  selectedResizeBy: null,
  selectedBiomeFilterName: null,
  isSearchOpen: false,
  noLinksFound: false,
  sankeyColumnsWidth: 100
};
