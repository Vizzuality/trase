export default {
  activeStep: null,
  panels: {
    type: null,
    commodities: {
      page: 1,
      searchResults: [],
      loadingItems: false,
      activeItems: [],
      activeTab: null
    },
    countries: {
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
    sources: {
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
    }
  },
  data: {
    commodities: [],
    countries: [],
    sources: {},
    companies: {},
    destinations: []
  },
  tabs: {}
};
