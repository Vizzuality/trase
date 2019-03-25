import { take, fork } from 'redux-saga/effects';
import { initialState } from 'react-components/dashboard-element/dashboard-element.reducer';
import {
  fetchDataOnPanelChange,
  fetchDashboardPanelInitialData,
  getSearchResults,
  onTabChange,
  onItemChange,
  onPageChange,
  onChangePanel
} from 'react-components/dashboard-element/dashboard-element.saga';
import {
  clearDashboardPanel,
  setDashboardPanelPage,
  setDashboardActivePanel,
  setDashboardPanelActiveItem,
  getDashboardPanelSearchResults,
  DASHBOARD_ELEMENT__SET_PANEL_TABS,
  DASHBOARD_ELEMENT__SET_PANEL_DATA,
  setDashboardPanelActiveItemWithSearch,
  DASHBOARD_ELEMENT__SET_SEARCH_RESULTS,
  DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_ACTIVE_PANEL,
  DASHBOARD_ELEMENT__CLEAR_PANELS
} from 'react-components/dashboard-element/dashboard-element.actions';
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
    ...initialState,
    activePanelId: 'countries',
    countriesPanel: {
      ...initialState.countriesPanel,
      activeItems: { 6: { id: 6, name: 'Brazil' } }
    }
  }
};

describe('fetchDashboardPanelInitialData', () => {
  const stateCompanies = {
    dashboardElement: {
      ...baseState.dashboardElement,
      activePanelId: 'companies'
    }
  };

  it(`dispatches ${DASHBOARD_ELEMENT__SET_PANEL_TABS} if the current active panel is companies`, async () => {
    const dispatched = await recordSaga(
      fetchDashboardPanelInitialData,
      setDashboardActivePanel('any'),
      stateCompanies
    );
    expect(dispatched).toContainEqual({
      payload: {
        data
      },
      type: DASHBOARD_ELEMENT__SET_PANEL_TABS
    });
  });

  it(`dispatches ${DASHBOARD_ELEMENT__SET_PANEL_DATA} for countries and sources if selected panel is sources`, async () => {
    const dispatched = await recordSaga(
      fetchDashboardPanelInitialData,
      setDashboardActivePanel('sources'),
      baseState
    );
    // Clears panel data
    expect(dispatched).toContainEqual({
      payload: {
        key: 'countries',
        data: null,
        meta: null,
        tab: null,
        loading: true
      },
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA
    });
    // Sets panel data for countries
    expect(dispatched).toContainEqual({
      payload: {
        key: 'countries',
        data,
        meta,
        tab: null,
        loading: false
      },
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA
    });
    // Sets panel data for regions
    expect(dispatched).toContainEqual({
      payload: {
        key: 'sources',
        data,
        meta,
        tab: null,
        loading: false
      },
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA
    });
  });

  it(`dispatches ${DASHBOARD_ELEMENT__SET_PANEL_DATA} if selected panel is not companies nor sources`, async () => {
    const dispatched = await recordSaga(
      fetchDashboardPanelInitialData,
      setDashboardActivePanel('commodities'),
      baseState
    );
    expect(dispatched).toContainEqual({
      payload: {
        key: 'commodities',
        data: null,
        meta: null,
        tab: null,
        loading: true
      },
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA
    });
  });
});

describe('getSearchResults', () => {
  it(`dispatches ${DASHBOARD_ELEMENT__SET_SEARCH_RESULTS} with the result of the search`, async () => {
    const query = 'a';
    const dispatched = await recordSaga(
      getSearchResults,
      getDashboardPanelSearchResults(query),
      baseState
    );
    expect(dispatched).toContainEqual({
      payload: {
        data,
        query
      },
      type: DASHBOARD_ELEMENT__SET_SEARCH_RESULTS
    });
  });
});

describe('onTabChange', () => {
  const sameTabChangeState = {
    dashboardElement: {
      ...baseState.dashboardElement,
      data: {
        ...baseState.dashboardElement.data,
        sources: {
          3: {
            someData: 'data'
          }
        }
      },
      sourcesPanel: {
        ...baseState.dashboardElement.sourcesPanel,
        activeTab: {
          id: 3
        }
      },
      activePanelId: 'sources'
    }
  };
  const differentTabChangeState = {
    dashboardElement: {
      ...sameTabChangeState.dashboardElement,
      data: {
        ...sameTabChangeState.dashboardElement.data,
        sources: {
          4: {
            someData: 'data'
          }
        }
      }
    }
  };
  const searchAction = setDashboardPanelActiveItemWithSearch({ nodeTypeId: 3 }, 'sources');

  it(`dispatches ${DASHBOARD_ELEMENT__SET_PANEL_DATA} if tab action is triggered`, async () => {
    const dispatched = await recordSaga(onTabChange, searchAction, differentTabChangeState);
    // Clears data
    expect(dispatched).toContainEqual({
      payload: {
        key: 'sources',
        data: null,
        meta: null,
        tab: 3,
        loading: true
      },
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA
    });
    expect(dispatched).toContainEqual({
      payload: {
        key: 'sources',
        data,
        meta,
        loading: false,
        tab: 3
      },
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA
    });
  });

  it('Does not call getDashboardPanelData if we already are in the target tab (we have data for it)', async () => {
    const dispatched = await recordSaga(onTabChange, searchAction, sameTabChangeState);
    expect(dispatched).not.toContainEqual({
      payload: {
        key: 'sources',
        data,
        meta,
        loading: false,
        tab: 3
      },
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA
    });
  });
});

describe('onItemChange', () => {
  const state = {
    dashboardElement: {
      ...baseState.dashboardElement,
      data: {
        ...baseState.dashboardElement.data,
        countries: {
          2: [{ id: 3, name: 'Brazil' }]
        },
        sources: {
          6: [{ id: 9, name: 'some-source' }]
        }
      },
      activePanelId: 'sources',
      sourcesPanel: {
        ...baseState.dashboardElement.sourcesPanel,
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
        ...state.dashboardElement.data,
        sources: {
          6: [{ name: 'data', id: 6 }]
        }
      },
      sourcesPanel: {
        ...state.dashboardElement.sourcesPanel,
        activeItems: { 2: { id: 2 } }
      }
    }
  };

  const changeToCountriesAction = setDashboardPanelActiveItem({ 5: { id: 5 } }, 'countries');
  const changeToSourcesAction = setDashboardPanelActiveItem({ 2: { id: 2 } }, 'sources');

  it(`dispatches ${DASHBOARD_ELEMENT__SET_PANEL_TABS} if we select countries`, async () => {
    const dispatched = await recordSaga(onItemChange, changeToCountriesAction, state);

    expect(dispatched).toContainEqual({
      payload: {
        data
      },
      type: DASHBOARD_ELEMENT__SET_PANEL_TABS
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
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA
    });
  });
});

describe('onChangePanel', () => {
  const state = {
    dashboardElement: {
      ...baseState.dashboardElement,
      activePanelId: 'countries',
      countriesPanel: {
        ...baseState.dashboardElement.countriesPanel,
        activeTab: {
          id: 1
        },
        activeItems: [{ id: 0 }]
      },
      commoditiesPanel: {
        ...baseState.dashboardElement.commoditiesPanel,
        activeTab: {
          id: 1
        },
        activeItems: [{ id: 0 }]
      },
      companiesPanel: {
        ...baseState.dashboardElement.companiesPanel,
        activeTab: {
          id: 1
        },
        activeItems: [{ id: 0 }]
      }
    }
  };

  it(`dispatches ${DASHBOARD_ELEMENT__CLEAR_PANELS} with the subsequent panels if the panel is changed`, async () => {
    const dispatched = await recordSaga(onChangePanel, clearDashboardPanel('commodities'), state);
    const panelsToClear = ['destinations', 'companies'];
    expect(dispatched).toContainEqual({
      payload: { panels: panelsToClear },
      type: DASHBOARD_ELEMENT__CLEAR_PANELS
    });
  });
});

describe('onPageChange', () => {
  const state = {
    dashboardElement: {
      ...baseState.dashboardElement,
      activePanelId: 'sources',
      sourcesPanel: {
        ...baseState.dashboardElement.countriesPanel,
        activeTab: { id: 2 },
        page: 2
      }
    }
  };
  const changePanelAction = setDashboardPanelPage(2, 'forward');

  it(`dispatches ${DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA} to retrieve the next page of data when scrolling`, async () => {
    const dispatched = await recordSaga(onPageChange, changePanelAction, state);
    expect(dispatched).toContainEqual({
      payload: {
        key: 'sources',
        data,
        tab: 2,
        direction: 'forward'
      },
      type: DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA
    });
  });
});

describe('fetchDataOnPanelChange', () => {
  const action = setDashboardActivePanel('companies');
  const generator = fetchDataOnPanelChange();
  it(`calls fetchDashboardPanelInitialData on first visit to panel`, () => {
    generator.next();
    // saga read the current dashboardElement state
    generator.next(action);
    // saga calls fetchDashboardPanelInitialData
    expect(generator.next(baseState.dashboardElement).value).toEqual(
      fork(fetchDashboardPanelInitialData, action)
    );
  });

  it(`doesn't call fetchDashboardPanelInitialData on second visit to panel`, () => {
    generator.next();
    generator.next(action);
    // saga calls fetchDashboardPanelInitialData
    expect(generator.next(baseState.dashboardElement).value).toEqual(
      take(DASHBOARD_ELEMENT__SET_ACTIVE_PANEL)
    );
  });

  it(`calls fetchDashboardPanelInitialData when an item has changed`, () => {
    const state = {
      ...baseState.dashboardElement,
      sourcesPanel: {
        ...baseState.dashboardElement.sourcesPanel,
        activeItems: {
          0: { id: 0, name: 'source' }
        }
      }
    };
    generator.next(action);
    generator.next(state);
    // saga calls fetchDashboardPanelInitialData
    expect(generator.next().value).toEqual(fork(fetchDashboardPanelInitialData, action));
  });
});
