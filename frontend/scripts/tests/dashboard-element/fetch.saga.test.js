import initialState from 'react-components/dashboard-element/dashboard-element.initial-state';
import { cancelled } from 'redux-saga/effects';
import { fetchWithCancel, setLoadingSpinner } from 'utils/saga-utils';

import {
  getDashboardPanelData,
  getDashboardPanelSectionTabs,
  fetchDashboardPanelSearchResults,
  getMoreDashboardPanelData
} from 'react-components/dashboard-element/dashboard-element.fetch.saga';
import { getURLFromParams } from 'utils/getURLFromParams';

jest.mock('utils/saga-utils', () => ({
  fetchWithCancel: jest.fn(),
  setLoadingSpinner: jest.fn()
}));

jest.mock('utils/getURLFromParams', () => ({
  getURLFromParams: jest.fn()
}));

const dashboardElement = {
  ...initialState,
  data: {
    ...initialState.data,
    countries: [{ id: 23, name: 'BOLIVIA' }]
  },
  tabs: {
    sources: [{ id: 1, name: 'BIOME' }]
  },
  activePanelId: 'sources',
  sourcesActiveTab: 1
};

const someUrl = 'http://trase.earth';
const sourceMock = { cancel: jest.fn() };
getURLFromParams.mockImplementation(() => someUrl);
fetchWithCancel.mockImplementation(() => ({ source: sourceMock, fetchPromise: () => {} }));
setLoadingSpinner.mockImplementation(() => {});

const optionsType = 'companies';
const query = 'Bra';
describe.skip('getDashboardPanelData', () => {
  jest.mock('utils/getURLFromParams', () => ({
    getURLFromParams: jest.fn()
  }));

  it('Cancels if the fetch is cancelled', () => {
    const generator = getDashboardPanelData(dashboardElement, optionsType);
    generator.next({});
    generator.next({});
    generator.next({});
    generator.next({});

    expect(generator.return().value).toEqual(cancelled());
    generator.next(true);
    expect(sourceMock.cancel).toBeCalled();
  });
});

describe.skip('getDashboardPanelSectionTabs', () => {
  it('Cancels if the fetch is cancelled', () => {
    const generator = getDashboardPanelSectionTabs(optionsType);
    generator.next({});
    generator.next({});
    expect(generator.return().value).toEqual(cancelled());
    generator.next(true);
    expect(sourceMock.cancel).toBeCalled();
  });
});

describe.skip('getMoreDashboardPanelData', () => {
  it('Cancels if the fetch is cancelled', () => {
    const generator = getMoreDashboardPanelData(dashboardElement, optionsType);
    generator.next();
    generator.next({ node_types_ids: 4 });
    generator.next();
    const cancel = generator.return().value;
    expect(cancel).toEqual(cancelled());
    generator.next(true);
    expect(sourceMock.cancel).toBeCalled();
  });
});

describe.skip('fetchDashboardPanelSearchResults', () => {
  it('Cancels if the fetch is cancelled', () => {
    const generator = fetchDashboardPanelSearchResults(dashboardElement, query);
    generator.next();
    generator.next({});
    generator.next({ node_types_ids: 1 });
    expect(generator.return().value).toEqual(cancelled());
    generator.next(true);
    expect(sourceMock.cancel).toBeCalled();
  });
});
