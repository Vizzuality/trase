import reducer, {
  initialState
} from 'react-components/dashboard-element/dashboard-element.reducer';
import {
  DASHBOARD_ELEMENT__SET_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_PANEL_PAGE,
  DASHBOARD_ELEMENT__SET_LOADING_ITEMS,
  DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_PANEL_TABS,
  DASHBOARD_ELEMENT__SET_ACTIVE_TAB,
  DASHBOARD_ELEMENT__CLEAR_PANEL,
  DASHBOARD_ELEMENT__SET_SEARCH_RESULTS,
  DASHBOARD_ELEMENT__SET_SELECTED_COUNTRY_ID,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH,
  DASHBOARD_ELEMENT__SET_SELECTED_YEARS,
  DASHBOARD_ELEMENT__SET_SELECTED_COMMODITY_ID,
  DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY,
  DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY,
  DASHBOARD_ELEMENT__SET_LOADING,
  DASHBOARD_ELEMENT__SET_CHARTS,
  setDashboardSelectedYears,
  setDashboardSelectedResizeBy,
  setDashboardSelectedRecolorBy,
  setDashboardCharts,
  setDashboardLoading,
  setDashboardPanelPage,
  setMoreDashboardPanelData,
  setDashboardPanelLoadingItems,
  setDashboardPanelActiveTab,
  clearDashboardPanel,
  editDashboard,
  setDashboardSelectedCountryId,
  setDashboardSelectedCommodityId
} from 'react-components/dashboard-element/dashboard-element.actions';

test.skip(DASHBOARD_ELEMENT__SET_PANEL_PAGE, () => {
  const action = setDashboardPanelPage(4);
  const state = {
    ...initialState,
    sourcesActiveTab: 2,
    sources: [23],
    activePanelId: 'sources'
  };
  const newState = reducer(state, action);
  expect(newState).toEqual({ ...state, pages: { ...initialState.pages, sources: 4 } });
});

describe.skip(DASHBOARD_ELEMENT__SET_PANEL_DATA, () => {
  const someData = [{ id: 0, name: 'name0' }, { id: 1, name: 'name1' }];

  it('adds data to an entity as an array', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
      payload: {
        key: 'commodities',
        data: someData
      }
    };
    const newState = reducer(initialState, action);
    expect(newState).toEqual({
      ...initialState,
      data: { ...initialState.data, commodities: someData }
    });
  });

  it('clears data from an array entity', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
      payload: { key: 'commodities', data: null }
    };
    const state = {
      ...initialState,
      data: {
        ...initialState.data,
        countries: someData,
        commodities: someData
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...initialState,
      data: {
        ...state.data,
        commodities: initialState.data.commodities
      }
    });
  });
});

describe.skip(DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA, () => {
  const someData = [{ id: 0, name: 'name0' }, { id: 1, name: 'name1' }];
  const moreData = [{ id: 2, name: 'Whatever' }];

  it('adds more data to an array entity', () => {
    const action = setMoreDashboardPanelData({
      data: moreData,
      key: 'commodities'
    });
    const state = {
      ...initialState,
      data: {
        ...initialState.data,
        commodities: someData
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      data: {
        ...state.data,
        commodities: [...someData, ...moreData]
      }
    });
  });

  it('resets the page number when theres no new data', () => {
    const action = setMoreDashboardPanelData({
      data: [],
      key: 'commodities'
    });
    const state = {
      ...initialState,
      data: {
        ...initialState.data,
        commodities: someData
      },
      pages: {
        ...initialState.pages,
        commodities: 3
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      pages: {
        ...state.pages,
        commodities: 2
      }
    });
  });
});

test.skip(DASHBOARD_ELEMENT__SET_LOADING_ITEMS, () => {
  const action = setDashboardPanelLoadingItems(true);

  const newState = reducer(initialState, action);
  expect(newState).toEqual({
    ...initialState,
    loadingItems: action.payload.loadingItems
  });
});

describe.skip(DASHBOARD_ELEMENT__SET_PANEL_TABS, () => {
  const data = [
    {
      section: 'SOURCES',
      tabs: [{ id: 3, name: 'MUNICIPALITY', prefix: 'a' }, { id: 1, name: 'BIOME', prefix: 'b' }]
    },
    {
      section: 'COMPANIES',
      tabs: [{ id: 6, name: 'EXPORTER', prefix: 'c' }, { id: 7, name: 'IMPORTER' }]
    }
  ];
  const expectedTabs = {
    sources: data[0].tabs
  };
  const action = {
    type: DASHBOARD_ELEMENT__SET_PANEL_TABS,
    payload: { data, key: 'sources' }
  };
  it('loads tabs for the first time', () => {
    const state = {
      ...initialState,
      activePanelId: 'sources'
    };

    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      tabs: expectedTabs,
      prefixes: {
        sources: {
          MUNICIPALITY: 'a',
          BIOME: 'b'
        },
        companies: {
          EXPORTER: 'c',
          IMPORTER: null
        }
      }
    });
  });

  it('resets page to initial state after loading tabs', () => {
    const state = {
      ...initialState,
      tabs: { sources: expectedTabs.sources },
      activePanelId: 'sources',
      sourcesActiveTab: expectedTabs.sources[0],
      pages: {
        ...initialState.pages,
        sources: 4
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      tabs: expectedTabs,
      pages: {
        ...state.pages,
        sources: initialState.pages.sources
      },
      prefixes: {
        sources: {
          MUNICIPALITY: 'a',
          BIOME: 'b'
        },
        companies: {
          EXPORTER: 'c',
          IMPORTER: null
        }
      }
    });
  });

  it('sets activeTab to previous value if it exists in new tabs', () => {
    const state = {
      ...initialState,
      tabs: { sources: expectedTabs.sources },
      activePanelId: 'sources',
      sourcesActiveTab: expectedTabs.sources[1]
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      tabs: expectedTabs,
      prefixes: {
        sources: {
          MUNICIPALITY: 'a',
          BIOME: 'b'
        },
        companies: {
          EXPORTER: 'c',
          IMPORTER: null
        }
      }
    });
  });
});

test.skip(DASHBOARD_ELEMENT__SET_ACTIVE_TAB, () => {
  const action = setDashboardPanelActiveTab(3, 'sources');
  const state = {
    ...initialState,
    pages: {
      ...initialState.pages,
      sources: 4
    },
    sourcesActiveTab: 1
  };
  const newState = reducer(state, action);
  expect(newState).toEqual({
    ...state,
    data: {
      ...state.data,
      sources: []
    },
    pages: {
      ...state.pages,
      sources: initialState.pages.sources
    },
    sourcesActiveTab: action.payload.activeTab
  });
});

describe.skip(DASHBOARD_ELEMENT__CLEAR_PANEL, () => {
  const state = {
    ...initialState,
    pages: {
      countries: 2,
      sources: 9,
      companies: 5
    },
    sourcesActiveTab: 2,
    companiesActiveTab: 1,
    selectedCountryId: 1,
    selectedCommodityId: 2,
    sources: [0],
    companies: [4]
  };
  it('clears a panel', () => {
    const action = clearDashboardPanel('companies');

    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      companies: [],
      companiesActiveTab: state.companiesActiveTab
    });
  });

  it('clears the selectedCountryId and following panels', () => {
    const action = clearDashboardPanel('countries');
    const onlyCountriesState = {
      ...state,
      sources: initialState.sources
    };
    const newState = reducer(onlyCountriesState, action);
    expect(newState).toEqual({
      ...onlyCountriesState,
      selectedCountryId: initialState.selectedCountryId,
      selectedCommodityId: initialState.selectedCommodityId,
      companies: initialState.companies
    });
  });
});

describe.skip(DASHBOARD_ELEMENT__SET_SEARCH_RESULTS, () => {
  const someResults = [
    { id: 0, name: 'some result' },
    { id: 2, name: 'some result2' },
    { id: 3, name: 'some result_3' }
  ];
  const action = {
    type: DASHBOARD_ELEMENT__SET_SEARCH_RESULTS,
    payload: {
      query: 'some result',
      data: someResults
    }
  };
  const someFuzzySearchResults = someResults.map((res, i) => ({ ...res, _distance: i }));
  const searchResults = ENABLE_LEGACY_TOOL_SEARCH ? someResults : someFuzzySearchResults;
  it('sets searchResults', () => {
    const state = {
      ...initialState,
      activePanelId: 'destinations'
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      searchResults
    });
  });
});

describe.skip(DASHBOARD_ELEMENT__SET_SELECTED_COUNTRY_ID, () => {
  const someItem = { id: 1, name: 'some item' };
  const someItem2 = { id: 3, name: 'some item2' };
  const action = setDashboardSelectedCountryId(someItem);
  it('Sets an active item', () => {
    const state = {
      ...initialState,
      pages: {
        ...initialState.pages,
        countries: 4
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      selectedCountryId: someItem.id
    });
  });

  it('Clears the rest of the panels, sources data and active tabs when changing country', () => {
    const state = {
      ...initialState,
      data: {
        sources: someItem2,
        commodities: someItem,
        companies: someItem2,
        destinations: someItem
      },
      sourcesActiveTab: 3,
      companiesActiveTab: 6,
      sources: [16],
      companies: [32],
      destinations: [100],
      selectedCountryId: 2,
      selectedCommodityId: 12
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      data: {
        ...state.data,
        sources: initialState.data.sources
      },
      selectedCountryId: someItem.id,
      sources: initialState.sources,
      companies: initialState.companies,
      destinations: initialState.destinations,
      sourcesActiveTab: initialState.sourcesActiveTab,
      companiesActiveTab: initialState.companiesActiveTab,
      selectedCommodityId: initialState.selectedCommodityId
    });
  });
});

describe.skip(DASHBOARD_ELEMENT__SET_SELECTED_COMMODITY_ID, () => {
  const someItem = { id: 1, name: 'some item' };
  const someItem2 = { id: 3, name: 'some item2' };
  const action = setDashboardSelectedCommodityId(someItem);
  it('Sets an active item', () => {
    const newState = reducer(initialState, action);
    expect(newState).toEqual({
      ...initialState,
      selectedCommodityId: someItem.id
    });
  });

  it('Clears the rest of the panels and companies active tab when changing commodity', () => {
    const state = {
      ...initialState,
      data: {
        sources: someItem2,
        commodities: someItem,
        companies: someItem2,
        destinations: someItem
      },
      sourcesActiveTab: 3,
      companiesActiveTab: 6,
      sources: [16],
      companies: [32],
      destinations: [100],
      selectedCountryId: 2,
      selectedCommodityId: 12
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      selectedCommodityId: someItem.id,
      companies: initialState.companies,
      destinations: initialState.destinations,
      companiesActiveTab: initialState.companiesActiveTab
    });
  });
});

test.skip(DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH, () => {
  const tabs = {
    sources: [{ id: 3, name: 'MUNICIPALITY', prefix: 'a' }, { id: 1, name: 'BIOME', prefix: 'b' }],
    companies: [{ id: 6, name: 'EXPORTER', prefix: 'c' }, { id: 7, name: 'IMPORTER' }]
  };
  const someItem = { id: 1, name: 'some item', nodeTypeId: 6 };
  const action = {
    type: DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH,
    payload: {
      panel: 'companies',
      activeItem: someItem
    }
  };
  const state = {
    ...initialState,
    tabs,
    companiesActiveTab: 7,
    pages: {
      ...initialState.pages,
      companies: 4
    }
  };
  const newState = reducer(state, action);
  expect(newState).toEqual({
    ...state,
    data: {
      ...state.data,
      companies: [someItem]
    },
    companies: [someItem.id],
    companiesActiveTab: tabs.companies[0].id,
    pages: {
      ...state.pages,
      companies: initialState.pages.companies
    }
  });
});

test(DASHBOARD_ELEMENT__SET_SELECTED_YEARS, () => {
  const years = [2010, 2015];
  const action = setDashboardSelectedYears(years);
  const newState = reducer(initialState, action);
  expect(newState).toEqual({
    ...initialState,
    selectedYears: years
  });
});

test(DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY, () => {
  const resizeBy = { attributeId: 0 };
  const action = setDashboardSelectedResizeBy(resizeBy);
  const newState = reducer(initialState, action);
  expect(newState).toEqual({
    ...initialState,
    selectedResizeBy: resizeBy.attributeId
  });
});

test(DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY, () => {
  const recolorBy = { attributeId: 1 };
  const action = setDashboardSelectedRecolorBy(recolorBy);
  const newState = reducer(initialState, action);
  expect(newState).toEqual({
    ...initialState,
    selectedRecolorBy: recolorBy.attributeId
  });
});

test(DASHBOARD_ELEMENT__SET_CHARTS, () => {
  const charts = {
    data: [{ type: 'bar_chart', url: 'my_url' }],
    meta: {
      groupings: {
        0: {
          id: 0,
          options: [{ id: 7, label: 'Number of environmental embargoes' }],
          defaultChartId: 7
        },
        1: {
          id: 1,
          options: [{ id: 8, label: 'Number of environmental embargoes' }],
          defaultChartId: 8
        }
      }
    }
  };
  const action = setDashboardCharts(charts);
  const newState = reducer(initialState, action);
  expect(newState).toEqual({
    ...initialState,
    charts
  });
});

test(DASHBOARD_ELEMENT__SET_LOADING, () => {
  const loading = true;
  const action = setDashboardLoading(loading);
  const newState = reducer(initialState, action);
  expect(newState).toEqual({
    ...initialState,
    loading
  });
});
