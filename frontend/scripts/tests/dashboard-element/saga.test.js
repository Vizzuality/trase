import {
  fetchDashboardPanelInitialData,
  getSearchResults,
  onTabChange,
  onItemChange,
  onFilterClear,
  onPageChange
} from 'react-components/dashboard-element/dashboard-element.saga';
import { getURLFromParams } from 'utils/getURLFromParams';
import { fetchWithCancel } from 'react-components/dashboard-element/fetch-with-cancel';
import { recordSaga } from '../utils/record-saga';

jest.mock('utils/getURLFromParams', () => ({
  getURLFromParams: jest.fn()
}));
jest.mock('react-components/dashboard-element/fetch-with-cancel', () => ({
  fetchWithCancel: jest.fn()
}));
const someUrl = 'http://trase.earth';
getURLFromParams.mockImplementation(() => someUrl);
const sourceMock = { cancel: jest.fn() };

const response = {
  data: {
    data: {
      hello: 1
    },
    meta: {
      hello: 2
    }
  }
};

fetchWithCancel.mockImplementation(() => ({
  source: sourceMock,
  fetchPromise: () => response
}));

const data = response.data.data;
const meta = response.data.meta;

const baseState = {
  dashboardElement: {
    activePanelId: 'countries',
    countriesPanel: {
      activeItem: 'Brazil'
    },
    sourcesPanel: {},
    commoditiesPanel: {},
    destinationsPanel: {},
    companiesPanel: {}
  }
};

describe('fetchDashboardPanelInitialData', () => {
  const setActiveAction = tab => ({
    type: 'DASHBOARD_ELEMENT__SET_ACTIVE_PANEL',
    payload: { activePanelId: tab }
  });

  const stateCompanies = {
    dashboardElement: {
      ...baseState.dashboardElement,
      activePanelId: 'companies'
    }
  };

  it('dispatches DASHBOARD_ELEMENT__SET_PANEL_TABS if the current active panel is companies', async () => {
    const dispatched = await recordSaga(
      fetchDashboardPanelInitialData,
      setActiveAction('any'),
      stateCompanies
    );
    expect(dispatched).toContainEqual({
      payload: {
        data
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_TABS'
    });
  });

  it('dispatches DASHBOARD_ELEMENT__SET_PANEL_DATA for countries and sources if selected panel is sources', async () => {
    const dispatched = await recordSaga(
      fetchDashboardPanelInitialData,
      setActiveAction('sources'),
      baseState
    );
    // Clears panel data
    expect(dispatched).toContainEqual({
      payload: {
        key: 'countries',
        data: null,
        meta: null,
        loading: true
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_DATA'
    });
    // Sets panel data for countries
    expect(dispatched).toContainEqual({
      payload: {
        key: 'countries',
        data,
        meta,
        loading: false
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_DATA'
    });
    // Sets panel data for regions
    expect(dispatched).toContainEqual({
      payload: {
        key: 'sources',
        data,
        meta,
        loading: false
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_DATA'
    });
  });

  it('dispatches DASHBOARD_ELEMENT__SET_PANEL_DATA if selected panel is not companies nor sources', async () => {
    const dispatched = await recordSaga(
      fetchDashboardPanelInitialData,
      setActiveAction('countries'),
      baseState
    );
    expect(dispatched).toContainEqual({
      payload: {
        key: 'countries',
        data: null,
        meta: null,
        loading: true
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_DATA'
    });
  });
});

describe('getSearchResults', () => {
  const searchAction = {
    type: 'DASHBOARD_ELEMENT__GET_SEARCH_RESULTS',
    payload: { query: 'a' }
  };

  it('dispatchs DASHBOARD_ELEMENT__SET_SEARCH_RESULTS with the result of the search', async () => {
    const dispatched = await recordSaga(getSearchResults, searchAction, baseState);
    expect(dispatched).toContainEqual({
      payload: {
        data
      },
      type: 'DASHBOARD_ELEMENT__SET_SEARCH_RESULTS'
    });
  });
});

describe('onTabChange', () => {
  const sameTabChangeState = {
    dashboardElement: {
      ...baseState.dashboardElement,
      data: {
        sources: {
          3: {
            someData: 'data'
          }
        }
      },
      countriesPanel: {
        activeTab: {
          id: 3
        }
      },
      activePanelId: 'countries'
    }
  };
  const differentTabChangeState = {
    dashboardElement: {
      ...sameTabChangeState.dashboardElement,
      data: {
        sources: {
          4: {
            someData: 'data'
          }
        }
      }
    }
  };
  const searchAction = {
    type: 'DASHBOARD_ELEMENT__SET_ACTIVE_ITEM_WITH_SEARCH',
    payload: { panel: 'countries' }
  };

  it('dispatches DASHBOARD_ELEMENT__SET_PANEL_DATA if tab action is triggered', async () => {
    const dispatched = await recordSaga(onTabChange, searchAction, differentTabChangeState);
    // Clears data
    expect(dispatched).toContainEqual({
      payload: {
        key: 'countries',
        data: null,
        meta: null,
        tab: 3,
        loading: true
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_DATA'
    });
    expect(dispatched).toContainEqual({
      payload: {
        key: 'countries',
        data,
        meta,
        loading: false,
        tab: 3
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_DATA'
    });
  });

  it('Does not call getDashboardPanelData if we already are in the target tab (we have data for it)', async () => {
    const dispatched = await recordSaga(onTabChange, searchAction, sameTabChangeState);
    expect(dispatched).not.toContainEqual({
      payload: {
        key: 'countries',
        data,
        meta,
        loading: false,
        tab: 3
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_DATA'
    });
  });
});

describe('onItemChange', () => {
  const state = {
    dashboardElement: {
      ...baseState.dashboardElement,
      data: {
        countries: {
          2: [{ id: 3, name: 'Brazil' }]
        },
        sources: {
          6: [{ id: 9, name: 'some-source' }]
        }
      },
      activePanelId: 'countries',
      countriesPanel: {
        activeTab: {
          id: 2
        }
      },
      sourcesPanel: {
        activeTab: {
          id: 6
        }
      }
    }
  };
  const otherState = {
    dashboardElement: {
      ...state.dashboardElement,
      data: {
        sources: {
          6: [{ name: 'data', id: 6 }]
        }
      }
    }
  };

  const changeToCountriesAction = {
    type: 'DASHBOARD_ELEMENT__SET_ACTIVE_ITEM',
    payload: { activeItem: { id: 5 }, panel: 'countries' }
  };
  const changeToSourcesAction = {
    type: 'DASHBOARD_ELEMENT__SET_ACTIVE_ITEM',
    payload: { activeItem: { id: 6 }, panel: 'sources' }
  };

  it('dispatches DASHBOARD_ELEMENT__SET_PANEL_TABS if we select countries', async () => {
    const dispatched = await recordSaga(onItemChange, changeToCountriesAction, state);

    expect(dispatched).toContainEqual({
      payload: {
        data
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_TABS'
    });
  });

  it('Recalculates getDashboardPanelData if the active item is missing', async () => {
    const dispatched = await recordSaga(onItemChange, changeToSourcesAction, state);

    expect(dispatched).toContainEqual({
      payload: {
        key: 'sources',
        data,
        meta,
        loading: false,
        tab: 2
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_DATA'
    });
  });

  it('Does not call getDashboardPanelData if we have the active item', async () => {
    const dispatched = await recordSaga(onItemChange, changeToSourcesAction, otherState);

    expect(dispatched).not.toContainEqual({
      payload: {
        key: 'sources',
        data,
        meta,
        loading: false,
        tab: 2
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_DATA'
    });
  });
});

describe('onFilterClear', () => {
  const state = {
    dashboardElement: {
      ...baseState.dashboardElement,
      activePanelId: 'sources',
      sourcesPanel: {
        activeTab: {
          id: 2
        },
        page: 2
      },
      countriesPanel: {
        activeItem: null
      }
    }
  };
  const sourcesStateWithActiveItem = {
    dashboardElement: {
      ...state.dashboardElement,
      countriesPanel: {
        activeItem: { id: 5 }
      }
    }
  };
  const countriesState = {
    dashboardElement: {
      ...state.dashboardElement,
      activePanelId: 'countries',
      countriesPanel: {
        activeTab: {
          id: 2
        },
        page: 2
      }
    }
  };

  const clearAction = {
    type: 'DASHBOARD_ELEMENT__CLEAR_PANEL',
    payload: { panel: 'companies' }
  };

  it('dispatchs DASHBOARD_ELEMENT__SET_PANEL_DATA for countries if the active panel is sources', async () => {
    const dispatched = await recordSaga(onFilterClear, clearAction, state);
    // Clears data
    expect(dispatched).toContainEqual({
      payload: {
        key: 'countries',
        data: null,
        meta: null,
        tab: 2,
        loading: true
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_DATA'
    });
    expect(dispatched).not.toContainEqual({
      payload: {
        key: 'sources',
        data: null,
        meta: null,
        tab: 2,
        loading: true
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_DATA'
    });
    // Sets data
    expect(dispatched).toContainEqual({
      payload: {
        key: 'countries',
        data,
        meta,
        loading: false,
        tab: 2
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_DATA'
    });
  });

  it('dispatchs DASHBOARD_ELEMENT__SET_PANEL_DATA for sources too if activeItem for that panel exists', async () => {
    const dispatched = await recordSaga(onFilterClear, clearAction, sourcesStateWithActiveItem);
    // Clears data
    expect(dispatched).toContainEqual({
      payload: {
        key: 'countries',
        data: null,
        meta: null,
        tab: 2,
        loading: true
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_DATA'
    });
    expect(dispatched).toContainEqual({
      payload: {
        key: 'sources',
        data: null,
        meta: null,
        tab: 2,
        loading: true
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_DATA'
    });
    // Sets data
    expect(dispatched).toContainEqual({
      payload: {
        key: 'countries',
        data,
        meta,
        loading: false,
        tab: 2
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_DATA'
    });
    expect(dispatched).toContainEqual({
      payload: {
        key: 'sources',
        data,
        meta,
        loading: false,
        tab: 2
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_DATA'
    });
  });

  it('Calls getDashboardPanelData for countries with the active panel if is not sources', async () => {
    const dispatched = await recordSaga(onFilterClear, clearAction, countriesState);
    // Clears data
    expect(dispatched).toContainEqual({
      payload: {
        key: 'countries',
        data: null,
        meta: null,
        tab: 2,
        loading: true
      },
      type: 'DASHBOARD_ELEMENT__SET_PANEL_DATA'
    });
  });
});

describe('onPageChange', () => {
  const state = {
    dashboardElement: {
      ...baseState.dashboardElement,
      activePanelId: 'countries',
      countriesPanel: {
        activeTab: {
          id: 2
        }
      }
    }
  };
  const changePanelAction = {
    type: 'DASHBOARD_ELEMENT__SET_PANEL_PAGE',
    payload: { direction: 'forward' }
  };

  it('dispatchs DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA to retrieve the next page of data when scrolling', async () => {
    const dispatched = await recordSaga(onPageChange, changePanelAction, state);
    expect(dispatched).toContainEqual({
      payload: {
        key: 'countries',
        data,
        tab: 2,
        direction: 'forward'
      },
      type: 'DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA'
    });
  });
});
