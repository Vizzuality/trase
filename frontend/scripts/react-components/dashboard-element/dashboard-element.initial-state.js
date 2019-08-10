export default {
  loading: false,
  editMode: false,
  data: {
    countries: [],
    companies: {},
    sources: {},
    destinations: [],
    commodities: []
  },
  tabs: {},
  activePanelId: null,
  countries: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItems: [],
    activeTab: null
  },
  sources: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItems: [],
    activeTab: null
  },
  destinations: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItems: [],
    activeTab: null
  },
  companies: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItems: [],
    activeTab: null
  },
  commodities: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItems: [],
    activeTab: null
  },
  selectedYears: null,
  selectedResizeBy: null,
  selectedRecolorBy: null,
  charts: null
};
