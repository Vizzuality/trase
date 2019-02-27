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
  DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR,
  DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR,
  DASHBOARD_ELEMENT__SET_SEARCH_RESULTS,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEM,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEM_WITH_SEARCH
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
    activeItem: 23
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
  const someMeta = { type: 'some metadata' };

  it('adds data to an entity as an array', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
      payload: {
        key: 'commodities',
        tab: null,
        data: someData,
        meta: someMeta,
        loading: false
      }
    };
    const state = { ...initialState, loading: true };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...initialState,
      loading: false,
      data: { ...initialState.data, commodities: someData },
      meta: { ...initialState.meta, commodities: someMeta }
    });
  });

  it('adds data to an entity as an object', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
      payload: {
        key: 'sources',
        tab: 1,
        loading: false,
        meta: someMeta,
        data: someData
      }
    };
    const state = { ...initialState, loading: true };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...initialState,
      loading: false,
      data: {
        ...initialState.data,
        sources: { 1: someData }
      },
      meta: { ...initialState.meta, sources: someMeta }
    });
  });

  it('clears data from an array entity', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
      payload: { key: 'commodities', tab: null, data: null, meta: null, loading: true }
    };
    const state = {
      ...initialState,
      loading: false,
      data: {
        ...initialState.data,
        countries: someData,
        commodities: someData
      },
      meta: { ...initialState.meta, commodities: someMeta }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...initialState,
      loading: true,
      data: {
        ...state.data,
        commodities: initialState.data.commodities
      },
      meta: {
        ...initialState.meta,
        commodities: null
      }
    });
  });

  it('clears data from an object entity', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
      payload: { key: 'sources', tab: null, data: null, meta: null, loading: true }
    };
    const state = {
      ...initialState,
      loading: false,
      data: {
        ...initialState.data,
        countries: someData,
        sources: { 1: someData, 2: someData }
      },
      meta: { ...initialState.meta, sources: someMeta }
    };

    const expected = {
      ...initialState,
      loading: true,
      data: {
        ...state.data,
        sources: initialState.data.sources
      },
      meta: {
        ...initialState.meta,
        sources: null
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
  const moreData = [{ id: 0, name: 'Whatever' }];

  it('adds more data to an array entity', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA,
      payload: {
        tab: null,
        data: moreData,
        key: 'commodities',
        direction: 'forward'
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
        key: 'sources',
        direction: 'forward'
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
        key: 'commodities',
        direction: 'forward'
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
    payload: { loadingItems: true }
  };
  const state = {
    ...initialState,
    activePanelId: 'sources'
  };
  const newState = reducer(state, action);
  expect(newState).toEqual({
    ...state,
    sourcesPanel: {
      ...state.sourcesPanel,
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
    sources: data[0].tabs,
    companies: data[1].tabs
  };
  const action = {
    type: DASHBOARD_ELEMENT__SET_PANEL_TABS,
    payload: { data }
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
      sourcesPanel: {
        ...state.sourcesPanel,
        activeTab: expectedTabs.sources[0]
      }
    });
  });

  it('resets page to inital state after loading tabs', () => {
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

  it('sets activeTab to first value if previous value doesnt exists in new tabs', () => {
    const newData = [...data];
    newData[0].tabs = [expectedTabs.sources[0]];
    const newAction = {
      type: DASHBOARD_ELEMENT__SET_PANEL_TABS,
      payload: {
        data: newData
      }
    };
    const state = {
      ...initialState,
      tabs: { sources: [expectedTabs.sources[0]] },
      activePanelId: 'sources',
      sourcesPanel: {
        ...initialState.sourcesPanel,
        activeTab: expectedTabs.sources[1]
      }
    };
    const newState = reducer(state, newAction);
    expect(newState).toEqual({
      ...state,
      tabs: { ...expectedTabs, sources: newData[0].tabs },
      sourcesPanel: {
        ...state.sourcesPanel,
        activeTab: expectedTabs.sources[0]
      }
    });
  });
});

test(DASHBOARD_ELEMENT__SET_ACTIVE_TAB, () => {
  const action = {
    type: DASHBOARD_ELEMENT__SET_ACTIVE_TAB,
    payload: {
      panel: 'sources',
      activeTab: { id: 3, name: 'MUNICIPALITY' }
    }
  };
  const state = {
    ...initialState,
    activeIndicatorsList: [{ id: 0, name: 'some indicator' }, { id: 3, name: 'some indicator3' }],
    sourcesPanel: {
      ...initialState.sourcesPanel,
      activeTab: { id: 1, name: 'BIOME' },
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
    activeIndicatorsList: [],
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
      activeItem: { id: 1, name: 'some item' },
      page: 2
    },
    sourcesPanel: {
      ...initialState.sourcesPanel,
      activeTab: { id: 2, name: 'some tab' },
      activeItem: { id: 0, name: 'some item' },
      page: 9
    },
    companiesPanel: {
      ...initialState.companiesPanel,
      activeTab: { id: 1, name: 'some tab' },
      activeItem: { id: 4, name: 'some item' },
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

test(DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR, () => {
  const anotherIndicator = { id: 4, name: 'another indicator' };
  const state = {
    ...initialState,
    activeIndicatorsList: [0]
  };
  const action = {
    type: DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR,
    payload: {
      active: anotherIndicator
    }
  };
  const newState = reducer(state, action);
  expect(newState).toEqual({
    ...initialState,
    activeIndicatorsList: [...state.activeIndicatorsList, anotherIndicator.id]
  });
});

test(DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR, () => {
  const someIndicator = { id: 4, name: 'some indicator' };
  const action = {
    type: DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR,
    payload: {
      toRemove: someIndicator
    }
  };
  const state = {
    ...initialState,
    activeIndicatorsList: [1, 3, 4]
  };
  const newState = reducer(state, action);
  expect(newState).toEqual({ ...state, activeIndicatorsList: [1, 3] });
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
        activeItem: { id: 0, name: 'brazil' }
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

  it('sets results in sourcePanel when a country is not selected', () => {
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
  it('sets active item in a single entity panel (not countries)', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_ACTIVE_ITEM,
      payload: {
        panel: 'companies',
        activeItem: someItem
      }
    };
    const state = {
      ...initialState,
      activeIndicatorsList: [0, 1, 2],
      companiesPanel: {
        ...initialState.companiesPanel,
        page: 4
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      activeIndicatorsList: [],
      companiesPanel: {
        ...state.companiesPanel,
        activeItem: someItem
      }
    });
  });

  it('sets active item in the countries panel', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_ACTIVE_ITEM,
      payload: {
        panel: 'countries',
        activeItem: someItem
      }
    };
    const state = {
      ...initialState,
      activeIndicatorsList: [0, 1, 2]
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      activeIndicatorsList: [],
      sourcesPanel: initialState.sourcesPanel,
      countriesPanel: {
        ...state.countriesPanel,
        activeItem: someItem
      }
    });
  });
});

test(DASHBOARD_ELEMENT__SET_ACTIVE_ITEM_WITH_SEARCH, () => {
  const tabs = {
    sources: [{ id: 3, name: 'MUNICIPALITY' }, { id: 1, name: 'BIOME' }],
    companies: [{ id: 6, name: 'EXPORTER' }, { id: 7, name: 'IMPORTER' }]
  };
  const someItem = { id: 1, name: 'some item', nodeTypeId: 6 };
  const action = {
    type: DASHBOARD_ELEMENT__SET_ACTIVE_ITEM_WITH_SEARCH,
    payload: {
      panel: 'companies',
      activeItem: someItem
    }
  };
  const state = {
    ...initialState,
    tabs,
    activeIndicatorsList: [1, 2, 3],
    companiesPanel: {
      ...initialState.companiesPanel,
      activeTab: { id: 7, name: 'IMPORTER' },
      page: 4
    }
  };
  const newState = reducer(state, action);
  expect(newState).toEqual({
    ...state,
    data: {
      ...state.data,
      companies: { 7: null }
    },
    activeIndicatorsList: [],
    companiesPanel: {
      ...state.companiesPanel,
      activeItem: someItem,
      activeTab: tabs.companies[0],
      page: initialState.companiesPanel.page
    }
  });
});
