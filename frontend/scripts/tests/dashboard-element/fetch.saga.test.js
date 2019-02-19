import { put, cancelled, call } from 'redux-saga/effects';
import { fetchWithCancel } from 'react-components/dashboard-element/fetch-with-cancel';

import {
  getDashboardPanelData,
  getDashboardPanelSectionTabs,
  fetchDashboardPanelSearchResults,
  getMoreDashboardPanelData,
  removeLoadingSpinner
} from 'react-components/dashboard-element/dashboard-element.fetch.saga';
import {
  DASHBOARD_ELEMENT__SET_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_PANEL_TABS,
  DASHBOARD_ELEMENT__SET_SEARCH_RESULTS,
  DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_LOADING_ITEMS
} from 'react-components/dashboard-element/dashboard-element.actions';
import { getURLFromParams } from 'utils/getURLFromParams';

jest.mock('react-components/dashboard-element/fetch-with-cancel', () => ({
  fetchWithCancel: jest.fn()
}));

jest.mock('utils/getURLFromParams', () => ({
  getURLFromParams: jest.fn()
}));

const dashboardElement = {
  data: {
    indicators: [],
    countries: [
      {
        id: 23,
        name: 'BOLIVIA'
      }
    ]
  },
  meta: {},
  tabs: {
    sources: [{ id: 1, name: 'BIOME' }]
  },
  activePanelId: 'sources',
  activeIndicatorsList: [],
  sourcesPanel: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItem: null,
    activeTab: {
      id: 1,
      name: 'BIOME'
    }
  },
  companiesPanel: {},
  countriesPanel: {},
  destinationsPanel: {},
  commoditiesPanel: {}
};

const someUrl = 'http://trase.earth';
const sourceMock = { cancel: jest.fn() };
getURLFromParams.mockImplementation(() => someUrl);
fetchWithCancel.mockImplementation(() => ({ source: sourceMock, fetchPromise: () => {} }));

describe('getDashboardPanelData', () => {
  const data = {
    data: { hello: 1 },
    meta: {}
  };
  const optionsType = 'companies';
  const options = undefined; // Do we use this page param?
  jest.mock('utils/getURLFromParams', () => ({
    getURLFromParams: jest.fn()
  }));

  it('Calls DASHBOARD_ELEMENT__SET_PANEL_DATA action to clear data', () => {
    const generator = getDashboardPanelData(dashboardElement, optionsType, options);
    expect(generator.next().value).toEqual(
      put({
        type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
        payload: {
          key: optionsType,
          tab: 1,
          data: null,
          meta: null,
          loading: true
        }
      })
    );
    generator.next();
    expect(generator.next({ data }).value).toEqual(
      put({
        type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
        payload: {
          key: optionsType,
          tab: 1,
          data: data.data,
          meta: data.meta,
          loading: false
        }
      })
    );
  });

  it('Calls DASHBOARD_ELEMENT__SET_PANEL_DATA action to clear data and Cancels if the fetch is cancelled', () => {
    const generator = getDashboardPanelData(dashboardElement, optionsType, options);
    expect(generator.next().value).toEqual(
      put({
        type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
        payload: {
          key: optionsType,
          tab: 1,
          data: null,
          meta: null,
          loading: true
        }
      })
    );
    generator.next();
    expect(generator.return().value).toEqual(cancelled());
    generator.next(true);
    expect(sourceMock.cancel).toBeCalled();
  });
});

describe('getDashboardPanelSectionTabs', () => {
  const data = {
    data: { hello: 1 },
    meta: {}
  };
  const optionsType = 'companies';

  it('Calls DASHBOARD_ELEMENT__SET_PANEL_TABS with the fetch data', () => {
    const generator = getDashboardPanelSectionTabs(dashboardElement, optionsType);
    generator.next();
    expect(generator.next({ data }).value).toEqual(
      put({
        type: DASHBOARD_ELEMENT__SET_PANEL_TABS,
        payload: {
          data: data.data
        }
      })
    );
  });

  it('Cancels if the fetch is cancelled', () => {
    const generator = getDashboardPanelSectionTabs(dashboardElement, optionsType);
    generator.next();
    expect(generator.return().value).toEqual(cancelled());
    generator.next(true);
    expect(sourceMock.cancel).toBeCalled();
  });
});

describe('getMoreDashboardPanelData', () => {
  const data = {
    data: { hello: 1 },
    meta: {}
  };

  it('Calls DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA action', () => {
    const optionsType = 'companies';
    const activeTab = { id: 4, name: 'BIOME' };
    const direction = 'FORWARD';
    const loadingAction = loading => ({
      payload: { loadingItems: loading },
      type: DASHBOARD_ELEMENT__SET_LOADING_ITEMS
    });
    const generator = getMoreDashboardPanelData(
      dashboardElement,
      optionsType,
      activeTab,
      direction
    );
    expect(generator.next().value).toEqual(put(loadingAction(true)));
    generator.next();
    expect(generator.next({ data }).value).toEqual(
      put({
        type: DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA,
        payload: {
          key: optionsType,
          tab: 4,
          data: data.data,
          direction
        }
      })
    );
    expect(generator.next().value).toEqual(call(removeLoadingSpinner));
  });

  it('Calls DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA action to clear data', () => {
    const query = 'Bra';
    const generator = fetchDashboardPanelSearchResults(dashboardElement, query);
    generator.next();
    expect(generator.return().value).toEqual(cancelled());
    generator.next(true);
    expect(sourceMock.cancel).toBeCalled();
  });
});

describe('fetchDashboardPanelSearchResults', () => {
  const data = {
    data: { hello: 1 },
    meta: {}
  };

  it('returns if there is no query ', () => {
    const query = null;
    const generator = fetchDashboardPanelSearchResults(dashboardElement, query);
    generator.next();
    expect(generator.next().value).toEqual(undefined);
  });

  it('Calls DASHBOARD_ELEMENT__SET_SEARCH_RESULTS action to clear data', () => {
    const query = 'Bra';
    const generator = fetchDashboardPanelSearchResults(dashboardElement, query);
    generator.next();
    expect(generator.next({ data }).value).toEqual(
      put({
        type: DASHBOARD_ELEMENT__SET_SEARCH_RESULTS,
        payload: {
          data: data.data
        }
      })
    );
  });

  it('Calls DASHBOARD_ELEMENT__SET_SEARCH_RESULTS action to clear data', () => {
    const query = 'Bra';
    const generator = fetchDashboardPanelSearchResults(dashboardElement, query);
    generator.next();
    expect(generator.return().value).toEqual(cancelled());
    generator.next(true);
    expect(sourceMock.cancel).toBeCalled();
  });
});
