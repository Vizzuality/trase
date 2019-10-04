export default {
  languages: [],
  isMapLayerVisible: false,
  isAppMenuVisible: false,
  tooltipCheck: 0,
  tooltips: null,
  contextIsUserSelected: !SHOW_WORLD_MAP_IN_EXPLORE,
  currentDropdown: null,
  data: {
    columns: null
  },
  modal: {
    visibility: false,
    modalParams: null
  },
  search: {
    term: '',
    isLoading: false,
    results: []
  },
  selectedContextId: null,
  selectedYears: null,
  contexts: [],
  topNodes: {},
  loading: {
    contexts: false,
    tooltips: false,
    topCountries: false
  }
};
