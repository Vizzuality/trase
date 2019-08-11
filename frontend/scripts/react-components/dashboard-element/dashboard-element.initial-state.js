export default {
  loading: false,
  editMode: false,
  data: {
    countries: [],
    companies: [],
    sources: [],
    destinations: [],
    commodities: []
  },
  tabs: {},
  activePanelId: null,
  countries: {
    page: 1
  },
  sources: {
    page: 1,
    activeTab: null
  },
  destinations: {
    page: 1
  },
  companies: {
    page: 1,
    activeTab: null
  },
  commodities: {
    page: 1
  },
  selectedCountryId: null,
  selectedCommodityId: null,
  selectedNodesIds: [],
  searchResults: [],
  loadingItems: false,
  selectedYears: null,
  selectedResizeBy: null,
  selectedRecolorBy: null,
  charts: null
};
