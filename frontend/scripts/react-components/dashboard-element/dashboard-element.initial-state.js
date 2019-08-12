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
    page: 1
  },
  destinations: {
    page: 1
  },
  companies: {
    page: 1
  },
  commodities: {
    page: 1
  },
  sourcesActiveTab: null,
  companiesActiveTab: null,
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
