import { take, takeLatest, select, all, fork, cancel, put } from 'redux-saga/effects';
import {
  PROFILES__SET_ACTIVE_STEP,
  PROFILES__SET_ACTIVE_ITEM,
  PROFILES__SET_ACTIVE_ITEM_WITH_SEARCH,
  PROFILES__SET_ACTIVE_TAB,
  PROFILES__SET_PANEL_TABS,
  PROFILES__SET_PANEL_PAGE,
  PROFILES__GET_SEARCH_RESULTS,
  PROFILES__CLEAR_PANELS
} from 'react-components/shared/profile-selector/profile-selector.actions';
import {
  getProfilesData,
  getProfilesTabs,
  getMoreProfilesData,
  fetchProfileSearchResults
} from 'react-components/shared/profile-selector/profile-panel/profile-panel.fetch.saga';
import getPanelStepName, { getPanelName } from 'utils/getProfilePanelName';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

export function* fetchProfilesInitialData() {
  const profileSelector = yield select(state => state.profileSelector);
  const panelName = getPanelName(profileSelector);
  if (panelName === 'types') return;
  if (panelName === 'sources') {
    yield fork(getProfilesData, 'countries');
    // Fetch regions
    if (!isEmpty(profileSelector.panels.countries.activeItems)) {
      yield fork(getProfilesData, 'sources');
    }
  } else if (panelName === 'companies') {
    yield fork(getProfilesTabs, 'companies');
  } else {
    yield fork(getProfilesData, panelName);
  }
}

/**
 * Checks if the activeItem in one of the panels has changed, if it has changed it fetches the panel data.
 */
export function* fetchDataOnPanelChange() {
  let loaded = [];
  let previousPanelState = null;
  let task = null;
  const hasChanged = panel => {
    if (!previousPanelState) return false;
    return !isEqual(
      panel.panels.countries.activeItems,
      previousPanelState.panels.countries.activeItems
    );
  };
  while (true) {
    const activePanel = yield take(PROFILES__SET_ACTIVE_STEP);
    const { activeStep } = activePanel.payload;
    const panelName = getPanelStepName(activeStep);
    const newPanelState = yield select(state => state.profileSelector);
    const changes = hasChanged(newPanelState);
    if (changes) {
      loaded = [previousPanelState.activeStep];
    }

    if (
      !previousPanelState ||
      (previousPanelState.data[activeStep] && previousPanelState.data[activeStep].length === 0) ||
      !loaded.includes(panelName)
    ) {
      if (task !== null) {
        yield cancel(task);
      }
      task = yield fork(fetchProfilesInitialData, activeStep);
      if (!loaded.includes(panelName)) {
        loaded.push(panelName);
      }
    }
    previousPanelState = newPanelState;
  }
}

/**
 * Listens to DASHBOARD_ELEMENT__SET_ACTIVE_ITEM and requests the tabs data every time a new country has been selected.
 */
export function* onItemChange(action) {
  const { panel, activeItem } = action.payload;
  // for now, we just need to recalculate the tabs when selecting a new country
  if (panel === 'countries' && !isEmpty(activeItem)) {
    yield fork(getProfilesTabs, 'sources');
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
  const { activeTab } = profileSelector.panels[panelName] || {};
  const currentTabId = activeTab && activeTab.id;
  if (!profileSelector.data.sources[currentTabId]) {
    yield fork(getProfilesData, panelName);
  }
}

function* fetchDataOnTabChange() {
  yield takeLatest(
    [PROFILES__SET_ACTIVE_ITEM_WITH_SEARCH, PROFILES__SET_ACTIVE_TAB, PROFILES__SET_PANEL_TABS],
    onTabChange
  );
}

/**
 * Listens to PROFILES__SET_PANEL_PAGE and fetches the data for the next page.
 */
export function* onPageChange(action) {
  const { direction } = action.payload;
  const { profileSelector } = yield select();
  const panelName = getPanelName(profileSelector);
  const { activeTab } = profileSelector.panels[panelName];
  yield fork(getMoreProfilesData, profileSelector, panelName, activeTab, direction);
}

function* fetchDataOnPageChange() {
  yield takeLatest(PROFILES__SET_PANEL_PAGE, onPageChange);
}

/**
 * Listens to actions that remove or clear panel items and deletes all subsequent selections if the panel is changed
 */

export function* onChangePanel(action) {
  const { panel } = action.payload;
  const profileSelector = yield select(state => state.profileSelector);
  let panelsToClear = [];
  switch (panel) {
    case 'types':
      panelsToClear = ['companies', 'countries', 'sources', 'commodities'];
      break;
    case 'countries':
      panelsToClear = ['sources', 'commodities'];
      break;
    case 'sources':
    case 'companies':
      panelsToClear = ['commodities'];
      break;
    default:
      break;
  }

  panelsToClear = panelsToClear.filter(p => !isEmpty(profileSelector.panels[p].activeItems));
  if (panelsToClear.length > 0) {
    yield put({
      type: PROFILES__CLEAR_PANELS,
      payload: {
        panels: panelsToClear
      }
    });
  }
}

function* clearSubsequentPanels() {
  yield takeLatest([PROFILES__SET_ACTIVE_ITEM], onChangePanel);
}

/**
 * Reads the query from the DASHBOARD_ELEMENT__GET_SEARCH_RESULTS action
 * and calls fetchProfileSearchResults to fetch the data.
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
    fetchDataOnSearch,
    clearSubsequentPanels
  ];
  yield all(sagas.map(saga => fork(saga)));
}
