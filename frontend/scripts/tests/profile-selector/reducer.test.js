import reducer, {
  initialState
} from 'react-components/shared/profile-selector/profile-selector.reducer';
import { PROFILE_STEPS } from 'constants';
import {
  PROFILES__SET_ACTIVE_STEP,
  PROFILES__SET_PANEL_PAGE,
  PROFILES__SET_PANEL_DATA,
  PROFILES__SET_MORE_PANEL_DATA,
  PROFILES__SET_LOADING_ITEMS,
  PROFILES__SET_PANEL_TABS,
  PROFILES__SET_ACTIVE_TAB,
  PROFILES__SET_SEARCH_RESULTS,
  PROFILES__SET_ACTIVE_ITEM,
  PROFILES__SET_ACTIVE_ITEM_WITH_SEARCH
} from 'react-components/shared/profile-selector/profile-selector.actions';

const activeTypePanel = panel => ({ type: panel });

describe(PROFILES__SET_ACTIVE_STEP, () => {
  const action = {
    type: PROFILES__SET_ACTIVE_STEP,
    payload: { activeStep: 'type' }
  };
  const expectedState = { ...initialState, activeStep: 'type' };

  it('sets correctly the activeStep', () => {
    const newState = reducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });
});

describe(PROFILES__SET_PANEL_PAGE, () => {
  const action = {
    type: PROFILES__SET_PANEL_PAGE,
    payload: { page: 4 }
  };
  const sourcesPanel = {
    ...initialState.panels.sources,
    activeTab: 2,
    activeItems: [23]
  };
  const state = {
    ...initialState,
    panels: {
      ...activeTypePanel('sources'),
      sources: sourcesPanel
    },
    activeStep: PROFILE_STEPS.profiles
  };
  const newState = reducer(state, action);
  expect(newState).toEqual({
    ...state,
    panels: {
      ...activeTypePanel('sources'),
      sources: { ...sourcesPanel, page: 4 }
    }
  });
});

describe(PROFILES__SET_PANEL_DATA, () => {
  const someData = [{ id: 0, name: 'name0' }, { id: 1, name: 'name1' }];

  it('adds data to a panel without tabs', () => {
    const action = {
      type: PROFILES__SET_PANEL_DATA,
      payload: {
        panelName: 'commodities',
        tab: null,
        data: someData
      }
    };
    const state = { ...initialState };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...initialState,
      data: { ...initialState.data, commodities: someData }
    });
  });

  it('adds data to a panel with tabs', () => {
    const action = {
      type: PROFILES__SET_PANEL_DATA,
      payload: {
        panelName: 'sources',
        tab: 3,
        data: someData
      }
    };
    const state = { ...initialState };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...initialState,
      data: { ...initialState.data, sources: { [action.payload.tab]: someData } }
    });
  });

  it('adds data to companies panel', () => {
    const action = {
      type: PROFILES__SET_PANEL_DATA,
      payload: {
        panelName: 'companies',
        tab: 3,
        data: someData
      }
    };
    const countriesPanel = {
      countries: {
        ...initialState.panels.countries,
        activeItems: [1]
      }
    };
    const state = {
      ...initialState,
      panels: {
        ...initialState.panels,
        ...countriesPanel
      }
    };

    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...initialState,
      panels: {
        ...initialState.panels,
        ...countriesPanel
      },
      data: {
        ...initialState.data,
        companies: {
          [state.panels.countries.activeItems[0]]: { [action.payload.tab]: someData }
        }
      }
    });
  });
});

describe(PROFILES__SET_MORE_PANEL_DATA, () => {
  const someData = [{ id: 0, name: 'name0' }, { id: 1, name: 'name1' }];
  const moreData = [{ id: 2, name: 'Whatever' }];

  it('adds more data to a panel', () => {
    const action = {
      type: PROFILES__SET_MORE_PANEL_DATA,
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

  it('adds more data to companies panel', () => {
    const action = {
      type: PROFILES__SET_MORE_PANEL_DATA,
      payload: {
        tab: 3,
        data: moreData,
        key: 'companies'
      }
    };

    const countries = {
      ...initialState.panels.countries,
      activeItems: [1]
    };
    const state = {
      ...initialState,
      panels: {
        ...initialState.panels,
        countries
      },
      data: {
        ...initialState.data,
        companies: { 1: { 3: someData } }
      }
    };
    const newState = reducer(state, action);
    const selectedCountryId = state.panels.countries.activeItems[0];
    const moreCountryData = {
      [selectedCountryId]: {
        ...state.data.companies[selectedCountryId],
        [action.payload.tab]: [...someData, ...moreData]
      }
    };
    expect(newState).toEqual({
      ...state,
      panels: {
        ...initialState.panels,
        countries
      },
      data: {
        ...state.data,
        companies: moreCountryData
      }
    });
  });

  it('resets the page number when theres no new data', () => {
    const action = {
      type: PROFILES__SET_MORE_PANEL_DATA,
      payload: {
        tab: null,
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
      panels: {
        ...initialState.panels,
        commodities: {
          ...initialState.panels.commodities,
          page: 3
        }
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      panels: {
        ...state.panels,
        commodities: {
          ...state.panels.commodities,
          page: 2
        }
      }
    });
  });
});

describe(PROFILES__SET_LOADING_ITEMS, () => {
  const action = {
    type: PROFILES__SET_LOADING_ITEMS,
    payload: { loadingItems: true }
  };
  const state = {
    ...initialState,
    activeStep: PROFILE_STEPS.commodities,
    panels: {
      ...initialState.panels
    }
  };
  const newState = reducer(state, action);
  expect(newState).toEqual({
    ...state,
    panels: {
      ...state.panels,
      commodities: {
        ...state.panels.commodities,
        loadingItems: action.payload.loadingItems
      }
    }
  });
});

describe(PROFILES__SET_PANEL_TABS, () => {
  const data = [
    { section: 'SOURCES', tabs: [{ id: 3, name: 'MUNICIPALITY' }, { id: 1, name: 'BIOME' }] },
    { section: 'COMPANIES', tabs: [{ id: 6, name: 'EXPORTER' }, { id: 7, name: 'IMPORTER' }] }
  ];
  const expectedTabs = {
    sources: data[0].tabs,
    companies: data[1].tabs
  };
  const action = {
    type: PROFILES__SET_PANEL_TABS,
    payload: { data, key: 'sources' }
  };

  it('loads tabs for the first time', () => {
    const state = {
      ...initialState,
      activeStep: PROFILE_STEPS.profiles,
      panels: {
        ...initialState.panels,
        ...activeTypePanel('sources')
      }
    };

    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      tabs: { sources: expectedTabs.sources }
    });
  });

  it('resets page to initial state after loading tabs', () => {
    const state = {
      ...initialState,
      activeStep: PROFILE_STEPS.profiles,
      tabs: { sources: expectedTabs.sources },
      panels: {
        ...initialState.panels,
        ...activeTypePanel('sources'),
        sources: {
          ...initialState.panels.sources,
          activeTab: expectedTabs.sources[0].id,
          page: 4
        }
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      panels: {
        ...state.panels,
        sources: {
          ...state.panels.sources,
          page: initialState.panels.sources.page
        }
      }
    });
  });

  it('sets activeTab to previous value if it exists in new tabs', () => {
    const state = {
      ...initialState,
      activeStep: PROFILE_STEPS.profiles,
      tabs: { sources: expectedTabs.sources },
      activePanelId: 'sources',
      panels: {
        ...activeTypePanel('sources'),
        sources: {
          ...initialState.panels.sources,
          activeTab: expectedTabs.sources[1]
        }
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      tabs: { sources: expectedTabs.sources }
    });
  });
});

test(PROFILES__SET_ACTIVE_TAB, () => {
  const action = {
    type: PROFILES__SET_ACTIVE_TAB,
    payload: {
      panel: 'profiles',
      activeTab: { id: 3, name: 'MUNICIPALITY' }
    }
  };
  const state = {
    ...initialState,
    activeStep: PROFILE_STEPS.profiles,
    panels: {
      ...activeTypePanel('sources'),
      sources: {
        ...initialState.sources,
        activeTab: { id: 1, name: 'BIOME' },
        page: 4
      }
    }
  };
  const newState = reducer(state, action);
  expect(newState).toEqual({
    ...state,
    data: {
      ...state.data,
      sources: {}
    },
    panels: {
      ...state.panels,
      sources: {
        ...state.panels.sources,
        activeTab: action.payload.activeTab,
        page: initialState.panels.sources.page
      }
    }
  });
});

describe(PROFILES__SET_SEARCH_RESULTS, () => {
  const someResults = [
    { id: 0, name: 'some result' },
    { id: 2, name: 'some result2' },
    { id: 3, name: 'some result_3' }
  ];
  const action = {
    type: PROFILES__SET_SEARCH_RESULTS,
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
      activeStep: PROFILE_STEPS.profiles,
      panels: {
        ...initialState.panels,
        ...activeTypePanel('companies')
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      panels: {
        ...state.panels,
        companies: {
          ...state.panels.companies,
          searchResults
        }
      }
    });
  });

  it('sets results in sourcePanel when a country is selected', () => {
    const state = {
      ...initialState,
      activeStep: PROFILE_STEPS.profiles,
      panels: {
        ...initialState.panels,
        ...activeTypePanel('sources'),
        countries: {
          ...initialState.panels.countries,
          activeItems: { id: 0, name: 'brazil' }
        }
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      panels: {
        ...state.panels,
        sources: {
          ...state.panels.sources,
          searchResults
        }
      }
    });
  });

  it('sets results in countriesPanel when a country is not selected', () => {
    const state = {
      ...initialState,
      activeStep: PROFILE_STEPS.profiles,
      panels: {
        ...initialState.panels,
        ...activeTypePanel('sources')
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      panels: {
        ...state.panels,
        countries: {
          ...state.panels.countries,
          searchResults
        }
      }
    });
  });
});

describe(PROFILES__SET_ACTIVE_ITEM, () => {
  const someItem = { id: 1, name: 'some item' };
  it('Sets an active item in a panel (not types)', () => {
    const action = {
      type: PROFILES__SET_ACTIVE_ITEM,
      payload: {
        panel: 'companies',
        activeItem: someItem
      }
    };
    const state = {
      ...initialState,
      panels: {
        ...initialState.panels,
        companies: {
          ...initialState.panels.companies,
          page: 4
        }
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      panels: {
        ...state.panels,
        companies: {
          ...state.panels.companies,
          activeItems: [someItem.id]
        }
      }
    });
  });

  it('Sets an active item in types panel', () => {
    const action = {
      type: PROFILES__SET_ACTIVE_ITEM,
      payload: {
        panel: 'type',
        activeItem: 'panelName'
      }
    };
    const newState = reducer(initialState, action);
    expect(newState).toEqual({
      ...initialState,
      panels: {
        ...initialState.panels,
        type: 'panelName'
      }
    });
  });
});

describe(PROFILES__SET_ACTIVE_ITEM_WITH_SEARCH, () => {
  const otherItems = [
    { id: 0, name: 'some item0', nodeTypeId: 6 },
    { id: 3, name: 'some item3', nodeTypeId: 6 }
  ];
  const tabs = {
    sources: [{ id: 3, name: 'MUNICIPALITY' }, { id: 1, name: 'BIOME' }],
    companies: [{ id: 6, name: 'EXPORTER' }, { id: 7, name: 'IMPORTER' }]
  };
  const someItem = { id: 1, name: 'some item', nodeTypeId: 6 };
  const action = {
    type: PROFILES__SET_ACTIVE_ITEM_WITH_SEARCH,
    payload: {
      panel: 'companies',
      activeItem: someItem
    }
  };

  it('sets an active item by search and adds it as data', () => {
    const state = {
      ...initialState,
      tabs,
      data: {
        ...initialState.data,
        companies: {
          1: {
            6: otherItems
          }
        }
      },
      panels: {
        ...initialState.panels,
        ...activeTypePanel('companies'),
        countries: {
          ...initialState.countries,
          activeItems: [1]
        },
        companies: {
          ...initialState.panels.companies,
          activeTab: 6
        }
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      data: {
        ...state.data,
        companies: {
          1: {
            6: [someItem, ...otherItems]
          }
        }
      },
      panels: {
        ...state.panels,
        companies: {
          ...state.panels.companies,
          activeItems: [someItem.id],
          activeTab: tabs.companies[0].id
        }
      }
    });
  });

  it('adds search result to the beginning of the data', () => {});
});
