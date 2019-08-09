import { takeLatest, select, all, fork, put, call } from 'redux-saga/effects';
import {
  PROFILES__SET_ACTIVE_STEP,
  PROFILES__SET_ACTIVE_ITEM,
  PROFILES__SET_ACTIVE_ITEM_WITH_SEARCH,
  PROFILES__SET_ACTIVE_TAB,
  PROFILES__SET_PANEL_PAGE,
  PROFILES__GET_SEARCH_RESULTS
} from 'react-components/shared/profile-selector/profile-selector.actions';
import {
  getProfilesData,
  getProfilesTabs,
  getMoreProfilesData,
  fetchProfileSearchResults
} from 'react-components/shared/profile-selector/profile-panel/profile-panel.fetch.saga';
import { getPanelName } from 'utils/getProfilePanelName';
import isEmpty from 'lodash/isEmpty';
import {
  getCompaniesActiveTab,
  getSourcesActiveTab
} from 'react-components/shared/profile-selector/profile-selector.selectors';

export function* fetchProfilesInitialData() {
  const profileSelector = yield select(state => state.profileSelector);
  const panelName = getPanelName(profileSelector);
  if (panelName === 'type') return;
  if (panelName === 'sources') {
    if (!isEmpty(profileSelector.data.sources)) {
      return;
    }
    yield fork(getProfilesData, 'countries');
    // Fetch regions
    if (profileSelector.panels.countries.activeItems.length > 0) {
      const tab = yield select(getSourcesActiveTab);
      yield fork(getProfilesData, 'sources', tab);
    }
  } else if (panelName === 'companies') {
    if (!isEmpty(profileSelector.data.companies)) {
      return;
    }
    yield call(getProfilesData, 'countries');
    const updatedProfileSelector = yield select(state => state.profileSelector);
    if (updatedProfileSelector.panels.countries.activeItems.length === 0) {
      const defaultCountry = updatedProfileSelector.data.countries[0];
      yield put({
        type: PROFILES__SET_ACTIVE_ITEM,
        payload: {
          panel: 'countries',
          activeItem: defaultCountry
        }
      });
    }
    yield fork(getProfilesTabs, 'companies');
  } else {
    yield fork(getProfilesData, panelName);
  }
}

export function* fetchDataOnPanelChange() {
  yield takeLatest(PROFILES__SET_ACTIVE_STEP, fetchProfilesInitialData);
}

/**
 * Listens to PROFILES__SET_ACTIVE_ITEM and requests the tabs data every time a new country has been selected.
 */
export function* onItemChange(action) {
  const { panel, activeItem } = action.payload;
  if (panel === 'countries' && activeItem) {
    yield fork(getProfilesTabs, 'sources');
    yield fork(getProfilesTabs, 'companies');
  }
}

function* fetchDataOnItemChange() {
  yield takeLatest([PROFILES__SET_ACTIVE_ITEM], onItemChange);
}

/**
 * Fetches the data for the activeTab if the data hasn't been loaded.
 */
export function* onTabChange() {
  const { profileSelector } = yield select();
  const panelName = getPanelName(profileSelector);
  let activeTabSelector = null;
  if (panelName === 'sources') {
    activeTabSelector = getSourcesActiveTab;
  }
  if (panelName === 'companies') {
    activeTabSelector = getCompaniesActiveTab;
  }
  const activeTab = activeTabSelector && (yield select(activeTabSelector));

  if (panelName && activeTab) {
    if (panelName === 'companies') {
      const activeCountry = profileSelector.panels.countries.activeItems[0];
      if (
        activeCountry &&
        profileSelector.data[panelName][activeCountry] &&
        profileSelector.data[panelName][activeCountry][activeTab] &&
        profileSelector.data[panelName][activeCountry][activeTab].length > 0
      ) {
        yield fork(getMoreProfilesData, panelName, activeTab);
      } else {
        yield fork(getProfilesData, panelName, activeTab);
      }
    } else if (
      profileSelector.data[panelName][activeTab] &&
      profileSelector.data[panelName][activeTab].length > 0
    ) {
      yield fork(getMoreProfilesData, panelName, activeTab);
    } else {
      yield fork(getProfilesData, panelName, activeTab);
    }
  }
}

function* fetchDataOnTabChange() {
  yield takeLatest([PROFILES__SET_ACTIVE_ITEM_WITH_SEARCH, PROFILES__SET_ACTIVE_TAB], onTabChange);
}

/**
 * Listens to PROFILES__SET_PANEL_PAGE and fetches the data for the next page.
 */
export function* onPageChange() {
  const { profileSelector } = yield select();
  const panelName = getPanelName(profileSelector);
  let activeTabSelector = null;
  if (panelName === 'sources') {
    activeTabSelector = getSourcesActiveTab;
  }
  if (panelName === 'companies') {
    activeTabSelector = getCompaniesActiveTab;
  }
  const activeTab = activeTabSelector && (yield select(activeTabSelector));
  yield fork(getMoreProfilesData, profileSelector, panelName, activeTab);
}

function* fetchDataOnPageChange() {
  yield takeLatest(PROFILES__SET_PANEL_PAGE, onPageChange);
}

/**
 * Reads the query from the PROFILES__GET_SEARCH_RESULTS action
 * and calls getSearchResults to fetch the data.
 */
export function* getSearchResults(action) {
  const profileSelector = yield select(state => state.profileSelector);
  const { query } = action.payload;
  yield fork(fetchProfileSearchResults, profileSelector, query);
}

function* fetchDataOnSearch() {
  yield takeLatest(PROFILES__GET_SEARCH_RESULTS, getSearchResults);
}

export default function* profilePanelSaga() {
  const sagas = [
    fetchDataOnPanelChange,
    fetchDataOnItemChange,
    fetchDataOnTabChange,
    fetchDataOnPageChange,
    fetchDataOnSearch
  ];
  yield all(sagas.map(saga => fork(saga)));
}
