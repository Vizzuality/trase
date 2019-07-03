import { take, takeLatest, select, all, fork, cancel } from 'redux-saga/effects';
import {
  PROFILES__SET_ACTIVE_STEP,
  PROFILES__SET_ACTIVE_ITEM,
  PROFILES__SET_ACTIVE_ITEMS
} from 'react-components/shared/profile-selector/profile-selector.actions';
import { PROFILE_STEPS } from 'constants';
import {
  getProfilesData,
  getProfilesTabs
  // getMoreProfilesData,
} from 'react-components/shared/profile-selector/profile-panel/profile-panel.fetch.saga';
import getPanelName from 'utils/getProfilePanelName';
import isEmpty from 'lodash/isEmpty';

export function* fetchProfilesInitialData(activePanel) {
  const state = yield select();
  const { profileSelector } = state;
  if (activePanel === PROFILE_STEPS.types) return;
  const activeType =
    activePanel === PROFILE_STEPS.profiles && profileSelector.panels.types.activeItems.type;
  if (activeType) {
    if (activeType === 'sources') {
      yield fork(getProfilesData, profileSelector, 'countries');
      // Fetch regions
      if (!isEmpty(profileSelector.panels.countries.activeItems)) {
        yield fork(getProfilesTabs, profileSelector, 'sources');
        yield fork(getProfilesData, profileSelector, 'sources');
      }
    } else {
      yield fork(getProfilesData, profileSelector, activeType);
    }
  } else {
    yield fork(getProfilesData, profileSelector);
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
    return (
      panel.panels.commodities.activeItems !== previousPanelState.panels.commodities.activeItems ||
      panel.panels.countries.activeItems !== previousPanelState.panels.countries.activeItems
    );
  };
  while (true) {
    const activePanel = yield take(PROFILES__SET_ACTIVE_STEP);
    const { activeStep } = activePanel.payload;
    const panelName = getPanelName(activeStep);
    const newPanelState = yield select(state => state.profileSelector);
    const changes = hasChanged(newPanelState);
    if (changes) {
      loaded = [previousPanelState.activeStep];
    }

    if (!previousPanelState || !loaded.includes(panelName)) {
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
  const profilesSelector = yield select(state => state.profileSelector);
  // for now, we just need to recalculate the tabs when selecting a new country
  if (panel === 'countries' && !isEmpty(activeItem)) {
    yield fork(getProfilesTabs, profilesSelector, 'sources');
  }
}

function* fetchDataOnItemChange() {
  yield takeLatest([PROFILES__SET_ACTIVE_ITEM, PROFILES__SET_ACTIVE_ITEMS], onItemChange);
}

// /**
//  * Listens to PROFILES__SET_PANEL_PAGE and fetches the data for the next page.
//  */
// export function* onPageChange(action) {
//   const { direction } = action.payload;
//   const { profileSelector } = yield select();
//   const panelName = getPanelName(profileSelector.activeStep);
//   const { activeTab } = profileSelector[panelName];
//   yield fork(
//     getMoreProfilesData,
//     profileSelector,
//     profileSelector.activePanelId,
//     activeTab,
//     direction
//   );
// }

// function* fetchDataOnPageChange() {
//   yield takeLatest(PROFILES__SET_PANEL_PAGE, onPageChange);
// }

export default function* profilePanelSaga() {
  const sagas = [
    fetchDataOnPanelChange,
    fetchDataOnItemChange
    // fetchDataOnPageChange
  ];
  yield all(sagas.map(saga => fork(saga)));
}
