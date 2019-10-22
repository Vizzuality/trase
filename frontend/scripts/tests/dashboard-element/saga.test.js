import { take, fork } from 'redux-saga/effects';
import initialState from 'react-components/dashboard-element-legacy/dashboard-element.initial-state';
import {
  fetchDataOnPanelChange,
  fetchDashboardPanelInitialData,
  getSearchResults,
  onTabChange,
  onItemChange,
  onPageChange
} from 'react-components/dashboard-element-legacy/dashboard-element.saga';
import {
  setDashboardPanelPage,
  setDashboardActivePanel,
  setDashboardSelectedCountryId,
  setDashboardSelectedCommodityId,
  getDashboardPanelSearchResults,
  setMoreDashboardPanelData,
  DASHBOARD_ELEMENT__SET_PANEL_TABS,
  DASHBOARD_ELEMENT__SET_PANEL_DATA,
  setDashboardPanelActiveItemsWithSearch,
  DASHBOARD_ELEMENT__SET_SEARCH_RESULTS,
  DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_ACTIVE_PANEL
} from 'react-components/dashboard-element-legacy/dashboard-element.actions';

import { getURLFromParams } from 'utils/getURLFromParams';
import { fetchWithCancel, setLoadingSpinner } from 'utils/saga-utils';
import { recordSaga } from '../utils/record-saga';

jest.mock('utils/getURLFromParams', () => ({
  getURLFromParams: jest.fn()
}));
jest.mock('utils/saga-utils', () => ({
  fetchWithCancel: jest.fn(),
  setLoadingSpinner: jest.fn()
}));
const someUrl = 'http://trase.earth';
getURLFromParams.mockImplementation(() => someUrl);
const sourceMock = { cancel: jest.fn() };

const response = {
  data: {
    data: {
      hello: 1
    }
  }
};

fetchWithCancel.mockImplementation(() => ({
  source: sourceMock,
  fetchPromise: () => response
}));
setLoadingSpinner.mockImplementation(() => {});

const data = response.data.data;

const baseState = {
  dashboardElement: {
    ...initialState,
    tabs: {
      sources: [
        { id: 3, name: 'MUNICIPALITY', prefix: 'a' },
        { id: 1, name: 'BIOME', prefix: 'b' }
      ],
      companies: [{ id: 6, name: 'EXPORTER', prefix: 'c' }, { id: 7, name: 'IMPORTER' }]
    },
    data: {
      ...initialState.data,
      countries: [{ id: 6, name: 'Brazil' }]
    },
    activePanelId: 'sources',
    selectedCountryId: 6
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
      setDashboardActivePanel('companies'),
      stateCompanies
    );
    expect(dispatched).toContainEqual({
      payload: {
        data,
        key: 'companies'
      },
      type: DASHBOARD_ELEMENT__SET_PANEL_TABS
    });
  });

  it(`dispatches ${DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA} for countries
   and ${DASHBOARD_ELEMENT__SET_PANEL_DATA}  sources if selected panel is sources and countries exists`, async () => {
    const dispatched = await recordSaga(
      fetchDashboardPanelInitialData,
      setDashboardActivePanel('sources'),
      baseState
    );
    // Sets panel data for countries
    expect(dispatched).toContainEqual(
      setMoreDashboardPanelData({
        key: 'countries',
        data
      })
    );
    // Sets panel data for regions
    expect(dispatched).toContainEqual({
      payload: {
        key: 'sources',
        data
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
        data
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
      sourcesActiveTab: 3
    }
  };
  const differentTabChangeState = {
    dashboardElement: {
      ...sameTabChangeState.dashboardElement,
      data: {
        ...sameTabChangeState.dashboardElement.data,
        sources: [{ id: 4, someData: 'data' }]
      },
      activePanelId: 'sources'
    }
  };
  const searchAction = setDashboardPanelActiveItemsWithSearch({ nodeTypeId: 3 }, 'sources');

  it(`dispatches ${DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA} if tab action is triggered and items exist`, async () => {
    const dispatched = await recordSaga(onTabChange, searchAction, differentTabChangeState);
    expect(dispatched).toContainEqual(
      setMoreDashboardPanelData({
        key: 'sources',
        data
      })
    );
  });

  it('Does not call getDashboardPanelData if we already are in the target tab (we have data for it)', async () => {
    const dispatched = await recordSaga(onTabChange, searchAction, sameTabChangeState);
    expect(dispatched).not.toContainEqual({
      payload: {
        key: 'sources',
        data,
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
        countries: [{ id: 3, name: 'Brazil' }],
        sources: [{ id: 9, name: 'some-source' }]
      },
      activePanelId: 'sources',
      sourcesActiveTab: 6
    }
  };
  const otherState = {
    dashboardElement: {
      ...state.dashboardElement,
      data: {
        ...state.dashboardElement.data,
        sources: [{ name: 'data', id: 6 }]
      },
      sources: [2]
    }
  };

  const changeToCountriesAction = setDashboardSelectedCountryId({ id: 5 });
  const changeToSourcesAction = setDashboardSelectedCommodityId({ id: 2 });

  it(`dispatches ${DASHBOARD_ELEMENT__SET_PANEL_TABS} for sources if we select countries`, async () => {
    const dispatched = await recordSaga(onItemChange, changeToCountriesAction, state);

    expect(dispatched).toContainEqual({
      payload: {
        data,
        key: 'sources'
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
        loading: false,
        tab: 2
      },
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA
    });
  });
});

describe('onPageChange', () => {
  const state = {
    dashboardElement: {
      ...baseState.dashboardElement,
      activePanelId: 'sources',
      pages: {
        ...baseState.pages,
        sources: 2
      },
      sourcesActiveTab: 2
    }
  };
  const changePanelAction = setDashboardPanelPage(2, 'forward');

  it(`dispatches ${DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA} to retrieve the next page of data when scrolling`, async () => {
    const dispatched = await recordSaga(onPageChange, changePanelAction, state);
    expect(dispatched).toContainEqual(
      setMoreDashboardPanelData({
        key: 'sources',
        data
      })
    );
  });
});

describe('fetchDataOnPanelChange', () => {
  const state = {
    ...initialState,
    data: { ...initialState.data, countries: [{ id: 1 }] },
    selectedCountryId: 1
  };
  const secondState = {
    ...state,
    data: {
      ...state.data,
      commodities: [{ id: 2 }]
    },
    selectedCommodityId: 2
  };

  const thirdState = {
    ...secondState,
    data: {
      ...secondState.data,
      countries: [{ id: 1 }, [{ id: 2 }]]
    }
  };
  const generator = fetchDataOnPanelChange();
  it(`calls fetchDashboardPanelInitialData on first visit to panel`, () => {
    const action = setDashboardActivePanel('commodities');
    generator.next();
    // saga read the current dashboardElement state
    generator.next(action);
    generator.next(state);
    generator.next(state.data.countries);
    generator.next(state.data.sources);
    generator.next(state.data.commodities);
    generator.next(state.data.destinations);
    // saga calls fetchDashboardPanelInitialData
    expect(generator.next(state.data.companies).value).toEqual(
      fork(fetchDashboardPanelInitialData, action)
    );
  });

  xit(`doesn't call fetchDashboardPanelInitialData on second visit to panel`, () => {
    const action = setDashboardActivePanel('sources');
    generator.next();
    generator.next(action);
    generator.next(secondState);
    generator.next();
    generator.next();
    generator.next();
    generator.next();
    // saga calls fetchDashboardPanelInitialData
    expect(generator.next(state).value).toEqual(take(DASHBOARD_ELEMENT__SET_ACTIVE_PANEL));
  });

  xit(`calls fetchDashboardPanelInitialData when an item has changed`, () => {
    const action = setDashboardActivePanel('commodities');
    generator.next();
    generator.next(action);
    generator.next(thirdState);
    // saga calls fetchDashboardPanelInitialData
    expect(generator.next().value).toEqual(fork(fetchDashboardPanelInitialData, action));
  });
});
