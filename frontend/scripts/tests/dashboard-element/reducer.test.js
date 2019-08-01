import reducer, {
  initialState
} from 'react-components/dashboard-element/dashboard-element.reducer';
import {
  DASHBOARD_ELEMENT__SET_ACTIVE_PANEL,
  DASHBOARD_ELEMENT__SET_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_PANEL_PAGE,
  DASHBOARD_ELEMENT__SET_LOADING_ITEMS,
  DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_PANEL_TABS,
  DASHBOARD_ELEMENT__SET_ACTIVE_TAB,
  DASHBOARD_ELEMENT__CLEAR_PANEL,
  DASHBOARD_ELEMENT__CLEAR_PANELS,
  DASHBOARD_ELEMENT__SET_SEARCH_RESULTS,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEM,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH,
  DASHBOARD_ELEMENT__SET_SELECTED_YEARS,
  setDashboardSelectedYears,
  setDashboardSelectedResizeBy,
  DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY,
  DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY,
  setDashboardSelectedRecolorBy,
  DASHBOARD_ELEMENT__SET_CHARTS,
  setDashboardCharts,
  DASHBOARD_ELEMENT__SET_LOADING,
  setDashboardLoading,
  setDashboardPanelActiveItems
} from 'react-components/dashboard-element/dashboard-element.actions';

describe(DASHBOARD_ELEMENT__SET_ACTIVE_PANEL, () => {
  const action = {
    type: DASHBOARD_ELEMENT__SET_ACTIVE_PANEL,
    payload: { activePanelId: 'sources' }
  };
  const expectedState = { ...initialState, activePanelId: 'sources' };

  it('sets correctly the activePanelId for the first time', () => {
    const newState = reducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('sets the previous panel page number to initial value', () => {
    const state = {
      ...initialState,
      activePanelId: 'companies',
      companiesPanel: {
        ...initialState.companiesPanel,
        page: 4
      }
    };

    const newState = reducer(state, action);
    expect(newState).toEqual(expectedState);
  });
});

test(DASHBOARD_ELEMENT__SET_PANEL_PAGE, () => {
  const action = {
    type: DASHBOARD_ELEMENT__SET_PANEL_PAGE,
    payload: { page: 4 }
  };
  const sourcesPanel = {
    ...initialState.sourcesPanel,
    activeTab: 2,
    activeItems: [23]
  };
  const state = {
    ...initialState,
    sourcesPanel,
    activePanelId: 'sources'
  };
  const newState = reducer(state, action);
  expect(newState).toEqual({ ...state, sourcesPanel: { ...sourcesPanel, page: 4 } });
});

describe(DASHBOARD_ELEMENT__SET_PANEL_DATA, () => {
  const someData = [{ id: 0, name: 'name0' }, { id: 1, name: 'name1' }];

  it('adds data to an entity as an array', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
      payload: {
        key: 'commodities',
        tab: null,
        data: someData
      }
    };
    const newState = reducer(initialState, action);
    expect(newState).toEqual({
      ...initialState,
      data: { ...initialState.data, commodities: someData }
    });
  });

  it('adds data to an entity as an object', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
      payload: {
        key: 'sources',
        tab: 1,
        data: someData
      }
    };
    const newState = reducer(initialState, action);
    expect(newState).toEqual({
      ...initialState,
      data: {
        ...initialState.data,
        sources: { 1: someData }
      }
    });
  });

  it('clears data from an array entity', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
      payload: { key: 'commodities', tab: null, data: null }
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

  it('clears data from an object entity', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
      payload: { key: 'sources', tab: null, data: null }
    };
    const state = {
      ...initialState,
      data: {
        ...initialState.data,
        countries: someData,
        sources: { 1: someData, 2: someData }
      }
    };

    const expected = {
      ...initialState,
      data: {
        ...state.data,
        sources: initialState.data.sources
      }
    };

    const newState = reducer(state, action);
    expect(newState).toEqual(expected);

    const tabReset = reducer(state, { ...action, payload: { ...action.payload, tab: 1 } });
    expect(tabReset).toEqual({
      ...expected,
      data: { ...expected.data, sources: { 1: null, 2: someData } }
    });
  });
});

describe(DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA, () => {
  const someData = [{ id: 0, name: 'name0' }, { id: 1, name: 'name1' }];
  const moreData = [{ id: 2, name: 'Whatever' }];

  it('adds more data to an array entity', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA,
      payload: {
        tab: null,
        data: moreData,
        key: 'commodities'
      }
    };
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

  it('adds more data to an object entity', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA,
      payload: {
        tab: 1,
        data: moreData,
        key: 'sources'
      }
    };
    const state = {
      ...initialState,
      data: {
        ...initialState.data,
        sources: {
          1: someData,
          2: someData
        }
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      data: {
        ...state.data,
        sources: {
          1: [...someData, ...moreData],
          2: someData
        }
      }
    });
  });

  it('resets the page number when theres no new data', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA,
      payload: {
        tab: 1,
        data: [],
        key: 'commodities'
      }
    };
    const state = {
      ...initialState,
      data: {
        ...initialState.data,
        commodities: someData
      },
      commoditiesPanel: {
        ...initialState.commoditiesPanel,
        page: 3
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      commoditiesPanel: {
        ...state.commoditiesPanel,
        page: 2
      }
    });
  });
});

test(DASHBOARD_ELEMENT__SET_LOADING_ITEMS, () => {
  const action = {
    type: DASHBOARD_ELEMENT__SET_LOADING_ITEMS,
    payload: { loadingItems: true, panelId: 'sources' }
  };

  const newState = reducer(initialState, action);
  expect(newState).toEqual({
    ...initialState,
    sourcesPanel: {
      ...initialState.sourcesPanel,
      loadingItems: action.payload.loadingItems
    }
  });
});

describe(DASHBOARD_ELEMENT__SET_PANEL_TABS, () => {
  const data = [
    { section: 'SOURCES', tabs: [{ id: 3, name: 'MUNICIPALITY' }, { id: 1, name: 'BIOME' }] },
    { section: 'COMPANIES', tabs: [{ id: 6, name: 'EXPORTER' }, { id: 7, name: 'IMPORTER' }] }
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
      tabs: expectedTabs
    });
  });

  it('resets page to initial state after loading tabs', () => {
    const state = {
      ...initialState,
      tabs: { sources: expectedTabs.sources },
      activePanelId: 'sources',
      sourcesPanel: {
        ...initialState.sourcesPanel,
        activeTab: expectedTabs.sources[0],
        page: 4
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      tabs: expectedTabs,
      sourcesPanel: {
        ...state.sourcesPanel,
        page: initialState.sourcesPanel.page
      }
    });
  });

  it('sets activeTab to previous value if it exists in new tabs', () => {
    const state = {
      ...initialState,
      tabs: { sources: expectedTabs.sources },
      activePanelId: 'sources',
      sourcesPanel: {
        ...initialState.sourcesPanel,
        activeTab: expectedTabs.sources[1]
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      tabs: expectedTabs
    });
  });
});

test(DASHBOARD_ELEMENT__SET_ACTIVE_TAB, () => {
  const action = {
    type: DASHBOARD_ELEMENT__SET_ACTIVE_TAB,
    payload: {
      panel: 'sources',
      activeTab: 3
    }
  };
  const state = {
    ...initialState,
    sourcesPanel: {
      ...initialState.sourcesPanel,
      activeTab: 1,
      page: 4
    }
  };
  const newState = reducer(state, action);
  expect(newState).toEqual({
    ...state,
    data: {
      ...state.data,
      sources: { 1: null }
    },
    sourcesPanel: {
      ...state.sourcesPanel,
      activeTab: action.payload.activeTab,
      page: initialState.sourcesPanel.page
    }
  });
});

describe(DASHBOARD_ELEMENT__CLEAR_PANEL, () => {
  const state = {
    ...initialState,
    countriesPanel: {
      ...initialState.countriesPanel,
      activeTab: { id: 6, name: 'some tab' },
      activeItems: [{ id: 1, name: 'some item' }],
      page: 2
    },
    sourcesPanel: {
      ...initialState.sourcesPanel,
      activeTab: { id: 2, name: 'some tab' },
      activeItems: [{ id: 0, name: 'some item' }],
      page: 9
    },
    companiesPanel: {
      ...initialState.companiesPanel,
      activeTab: { id: 1, name: 'some tab' },
      activeItems: [{ id: 4, name: 'some item' }],
      page: 5
    }
  };
  it('clears a panel with only one entity (not sources)', () => {
    const action = {
      type: DASHBOARD_ELEMENT__CLEAR_PANEL,
      payload: {
        panel: 'companies'
      }
    };

    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      companiesPanel: {
        ...initialState.companiesPanel,
        activeTab: state.companiesPanel.activeTab
      }
    });
  });

  it('clears a panel with multiple entities (source panel)', () => {
    const action = {
      type: DASHBOARD_ELEMENT__CLEAR_PANEL,
      payload: {
        panel: 'sources'
      }
    };

    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      countriesPanel: initialState.countriesPanel,
      sourcesPanel: {
        ...initialState.sourcesPanel,
        activeTab: state.sourcesPanel.activeTab
      }
    });
  });

  it('clears the countriesPanel', () => {
    const action = {
      type: DASHBOARD_ELEMENT__CLEAR_PANEL,
      payload: {
        panel: 'countries'
      }
    };
    const onlyCountriesState = {
      ...state,
      sourcesPanel: initialState.sourcesPanel
    };
    const newState = reducer(onlyCountriesState, action);
    expect(newState).toEqual({
      ...onlyCountriesState,
      countriesPanel: initialState.countriesPanel
    });
  });
});

describe(DASHBOARD_ELEMENT__CLEAR_PANELS, () => {
  const state = {
    ...initialState,
    countriesPanel: {
      ...initialState.countriesPanel,
      activeItems: [{ id: 1, name: 'some item' }],
      activeTab: { id: 7, name: 'BIOME' },
      page: 2
    },
    commoditiesPanel: {
      ...initialState.commoditiesPanel,
      activeItems: [{ id: 4, name: 'some item' }],
      activeTab: { id: 1 },
      page: 6
    },
    companiesPanel: {
      ...initialState.companiesPanel,
      activeItems: [{ id: 4, name: 'some item' }],
      activeTab: { id: 7, name: 'IMPORTER' },
      page: 5
    }
  };

  it('clears panels', () => {
    const action = {
      type: DASHBOARD_ELEMENT__CLEAR_PANELS,
      payload: {
        panels: ['companies', 'commodities']
      }
    };

    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      countriesPanel: state.countriesPanel,
      companiesPanel: {
        ...initialState.companiesPanel,
        activeTab: state.companiesPanel.activeTab
      },
      commoditiesPanel: {
        ...initialState.commoditiesPanel,
        activeTab: state.commoditiesPanel.activeTab
      }
    });
  });
});

describe(DASHBOARD_ELEMENT__SET_SEARCH_RESULTS, () => {
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
  it('sets results in a panel with a single entity (not sources)', () => {
    const state = {
      ...initialState,
      activePanelId: 'destinations'
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      destinationsPanel: {
        ...state.destinationsPanel,
        searchResults
      }
    });
  });

  it('sets results in sourcePanel when a country is selected', () => {
    const state = {
      ...initialState,
      activePanelId: 'sources',
      countriesPanel: {
        ...initialState.countriesPanel,
        activeItems: { id: 0, name: 'brazil' }
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      sourcesPanel: {
        ...state.sourcesPanel,
        searchResults
      }
    });
  });

  it('sets results in countriesPanel when a country is not selected', () => {
    const state = {
      ...initialState,
      activePanelId: 'sources'
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      countriesPanel: {
        ...state.countriesPanel,
        searchResults
      }
    });
  });
});

describe(DASHBOARD_ELEMENT__SET_ACTIVE_ITEM, () => {
  const someItem = { id: 1, name: 'some item' };
  it('Sets an active item in a single entity panel', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_ACTIVE_ITEM,
      payload: {
        panel: 'companies',
        activeItem: someItem
      }
    };
    const state = {
      ...initialState,
      companiesPanel: {
        ...initialState.companiesPanel,
        page: 4
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      companiesPanel: {
        ...state.companiesPanel,
        activeItems: [someItem.id]
      }
    });
  });

  it('Clears the current sources when selecting a country in the sources panel', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_ACTIVE_ITEM,
      payload: {
        panel: 'countries',
        activeItem: someItem
      }
    };
    const state = {
      ...initialState,
      sourcesPanel: {
        activeTab: 3,
        activeItems: [16]
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      sourcesPanel: initialState.sourcesPanel,
      countriesPanel: {
        ...state.countriesPanel,
        activeItems: [someItem.id]
      }
    });
  });
});

describe(DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS, () => {
  const someItem = { id: 1, name: 'some item' };
  it('sets active item in a multiple entity panel', () => {
    const action = setDashboardPanelActiveItems(someItem, 'companies');
    const state = {
      ...initialState,
      companiesPanel: {
        ...initialState.companiesPanel,
        page: 4
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      companiesPanel: {
        ...state.companiesPanel,
        activeItems: [someItem.id]
      }
    });
  });
});

test(DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH, () => {
  const tabs = {
    sources: [{ id: 3, name: 'MUNICIPALITY' }, { id: 1, name: 'BIOME' }],
    companies: [{ id: 6, name: 'EXPORTER' }, { id: 7, name: 'IMPORTER' }]
  };
  const someItem = { id: 1, name: 'some item', nodeTypeId: 6 };
  const action = {
    type: DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH,
    payload: {
      panel: 'companies',
      activeItems: someItem
    }
  };
  const state = {
    ...initialState,
    tabs,
    companiesPanel: {
      ...initialState.companiesPanel,
      activeTab: 7,
      page: 4
    }
  };
  const newState = reducer(state, action);
  expect(newState).toEqual({
    ...state,
    data: {
      ...state.data,
      companies: {
        7: null,
        6: [someItem]
      }
    },
    companiesPanel: {
      ...state.companiesPanel,
      activeItems: [someItem.id],
      activeTab: tabs.companies[0].id,
      page: initialState.companiesPanel.page
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
