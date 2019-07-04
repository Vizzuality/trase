import { put, call, cancelled, fork } from 'redux-saga/effects';
import getPanelName from 'utils/getProfilePanelName';
import {
  PROFILES__SET_PANEL_DATA,
  PROFILES__SET_PANEL_TABS,
  getProfilesParams
} from 'react-components/shared/profile-selector/profile-selector.actions';
import {
  getURLFromParams,
  GET_DASHBOARD_OPTIONS_URL,
  GET_DASHBOARD_OPTIONS_TABS_URL
} from 'utils/getURLFromParams';
import { PROFILE_STEPS } from 'constants';
import { fetchWithCancel, setLoadingSpinner } from 'utils/saga-utils';

export function* getProfilesData(profileSelector, subPanelName, options) {
  if (!profileSelector.activeStep || profileSelector.activeStep === PROFILE_STEPS.types) return;
  const panelName = subPanelName || getPanelName(profileSelector.activeStep);
  const { page, activeTab } = profileSelector.panels[panelName];
  const tab = activeTab?.id;
  const params = getProfilesParams(profileSelector, panelName, {
    page,
    ...options
  });
  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_URL, params);
  const task = yield fork(setLoadingSpinner, 750, {
    type: PROFILES__SET_PANEL_DATA,
    payload: {
      panelName,
      tab,
      data: null,
      meta: null,
      loading: true
    }
  });
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    if (task.isRunning()) {
      task.cancel();
    }
    yield put({
      type: PROFILES__SET_PANEL_DATA,
      payload: {
        panelName,
        tab,
        data: data.data,
        meta: data.meta,
        loading: false
      }
    });
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (NODE_ENV_DEV) console.error('Cancelled', tab);
      if (source) {
        source.cancel();
      }
    }
  }
}

// export function* getMoreProfilesData(dashboardElement, optionsType, activeTab, direction) {
//   const { page } = dashboardElement[`${dashboardElement.activePanelId}Panel`];
//   const params = getProfilesParams(dashboardElement, optionsType, {
//     page
//   });
//   const task = yield fork(setLoadingSpinner, 350, setProfilesLoadingItems(true));
//   const url = getURLFromParams(GET_DASHBOARD_OPTIONS_URL, params);
//   const { source, fetchPromise } = fetchWithCancel(url);
//   try {
//     const { data } = yield call(fetchPromise);
//     yield put({
//       type: PROFILES__SET_MORE_PANEL_DATA,
//       payload: {
//         key: optionsType,
//         tab: activeTab && activeTab.id,
//         direction,
//         data: data.data
//       }
//     });
//     if (task.isRunning()) {
//       task.cancel();
//     } else {
//       yield call(setLoadingSpinner, 750, setProfilesLoadingItems(false));
//     }
//   } catch (e) {
//     console.error('Error', e);
//     if (task.isRunning()) {
//       task.cancel();
//     } else {
//       yield call(setLoadingSpinner, 750, setProfilesLoadingItems(false));
//     }
//   } finally {
//     if (yield cancelled()) {
//       if (NODE_ENV_DEV) console.error('Cancelled', url);
//       if (source) {
//         source.cancel();
//       }
//     }
//   }
// }

export function* getProfilesTabs(profileSelector, optionsType) {
  const params = getProfilesParams(profileSelector, optionsType);
  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_TABS_URL, params);
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put({
      type: PROFILES__SET_PANEL_TABS,
      payload: {
        data: data.data
      }
    });
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (NODE_ENV_DEV) console.error('Cancelled', url);
      if (source) {
        source.cancel();
      }
    }
  }
}
