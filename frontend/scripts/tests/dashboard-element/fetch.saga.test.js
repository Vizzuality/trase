import { initialState } from 'react-components/dashboard-element/dashboard-element.reducer';
import { cancelled } from 'redux-saga/effects';
import { fetchWithCancel } from 'utils/saga-utils';

import {
  getDashboardPanelData,
  getDashboardPanelSectionTabs,
  fetchDashboardPanelSearchResults
} from 'react-components/dashboard-element/dashboard-element.fetch.saga';
import { getURLFromParams } from 'utils/getURLFromParams';

jest.mock('utils/saga-utils', () => ({
  fetchWithCancel: jest.fn()
}));

jest.mock('utils/getURLFromParams', () => ({
  getURLFromParams: jest.fn()
}));

const dashboardElement = {
  ...initialState,
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
  sourcesPanel: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItems: {},
    activeTab: {
      id: 1,
      name: 'BIOME'
    }
  }
};

const someUrl = 'http://trase.earth';
const sourceMock = { cancel: jest.fn() };
getURLFromParams.mockImplementation(() => someUrl);
fetchWithCancel.mockImplementation(() => ({ source: sourceMock, fetchPromise: () => {} }));

const optionsType = 'companies';
const query = 'Bra';
describe('getDashboardPanelData', () => {
  jest.mock('utils/getURLFromParams', () => ({
    getURLFromParams: jest.fn()
  }));

  it('Cancels if the fetch is cancelled', () => {
    const generator = getDashboardPanelData(dashboardElement, optionsType);
    generator.next();
    generator.next();
    expect(generator.return().value).toEqual(cancelled());
    generator.next(true);
    expect(sourceMock.cancel).toBeCalled();
  });
});

describe('getDashboardPanelSectionTabs', () => {
  it('Cancels if the fetch is cancelled', () => {
    const generator = getDashboardPanelSectionTabs(dashboardElement, optionsType);
    generator.next();
    expect(generator.return().value).toEqual(cancelled());
    generator.next(true);
    expect(sourceMock.cancel).toBeCalled();
  });
});

describe('getMoreDashboardPanelData', () => {
  it('Cancels if the fetch is cancelled', () => {
    const generator = fetchDashboardPanelSearchResults(dashboardElement, query);
    generator.next();
    expect(generator.return().value).toEqual(cancelled());
    generator.next(true);
    expect(sourceMock.cancel).toBeCalled();
  });
});

describe('fetchDashboardPanelSearchResults', () => {
  it('Cancels if the fetch is cancelled', () => {
    const generator = fetchDashboardPanelSearchResults(dashboardElement, query);
    generator.next();
    expect(generator.return().value).toEqual(cancelled());
    generator.next(true);
    expect(sourceMock.cancel).toBeCalled();
  });
});
