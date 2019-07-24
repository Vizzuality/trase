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
  meta: {},
  tabs: {},
  activePanelId: null,
  countriesPanel: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItems: {},
    activeTab: null
  },
  sourcesPanel: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItems: {},
    activeTab: null
  },
  destinationsPanel: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItems: {},
    activeTab: null
  },
  companiesPanel: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItems: {},
    activeTab: null
  },
  commoditiesPanel: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItems: {},
    activeTab: null
  },
  selectedYears: null,
  selectedResizeBy: null,
  selectedRecolorBy: null,
  charts: null,
  chartsLoading: false
};
