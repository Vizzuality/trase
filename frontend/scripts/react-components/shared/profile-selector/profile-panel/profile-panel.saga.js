import { take, select, all, fork, cancel } from 'redux-saga/effects';
import { PROFILES__SET_ACTIVE_STEP } from 'react-components/shared/profile-selector/profile-selector.actions';
import {
  getProfilesData
  // getMoreProfilesData,
} from 'react-components/shared/profile-selector/profile-panel/profile-panel.fetch.saga';
import getPanelName from 'utils/getProfilePanelName';

export function* fetchProfilesInitialData(action) {
  const { activePanel } = action.payload;
  const state = yield select();
  const { profileSelector } = state;

  yield fork(getProfilesData, profileSelector, activePanel);
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
      panel.panels.commodities.activeItems !== previousPanelState.panels.commodities.activeItems
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
      task = yield fork(fetchProfilesInitialData, activePanel);
      if (!loaded.includes(panelName)) {
        loaded.push(panelName);
      }
    }
    previousPanelState = newPanelState;
  }
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
    fetchDataOnPanelChange
    // fetchDataOnPageChange
  ];
  yield all(sagas.map(saga => fork(saga)));
}
