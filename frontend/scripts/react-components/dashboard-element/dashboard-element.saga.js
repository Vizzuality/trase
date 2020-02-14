import { select, all, fork, takeLatest, call, put } from 'redux-saga/effects';
import {
  setDashboardLoading,
  DASHBOARD_ELEMENT__GO_TO_DASHBOARD,
  DASHBOARD_ELEMENT__SET_SELECTED_YEARS,
  DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY,
  DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY
} from 'react-components/dashboard-element/dashboard-element.actions';
import { fetchDashboardCharts } from 'react-components/dashboard-element/dashboard-element.fetch.saga';
import { getDashboardsContext } from 'react-components/dashboard-element/dashboard-element.selectors';
import {
  getData,
  getMissingItems,
  getSectionTabs
} from 'react-components/nodes-panel/nodes-panel.fetch.saga';
import {
  setFetchKey,
  NODES_PANEL__GET_MISSING_DATA
} from 'react-components/nodes-panel/nodes-panel.actions';
import modules from 'react-components/nodes-panel/nodes-panel.modules';
import {
  getSourcesPreviousSteps,
  getExportersPreviousSteps,
  getImportersPreviousSteps
} from 'react-components/nodes-panel/nodes-panel.selectors';

export function* updateIndicatorsOnItemChange() {
  const selectedContext = yield select(getDashboardsContext);
  if (selectedContext) {
    yield fork(fetchDashboardCharts);
  }
}

function* fetchChartsOnItemChange() {
  yield takeLatest([DASHBOARD_ELEMENT__GO_TO_DASHBOARD], updateIndicatorsOnItemChange);
}

function* fetchChartsOnIndicatorsChange() {
  yield takeLatest(
    [
      DASHBOARD_ELEMENT__SET_SELECTED_YEARS,
      DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY,
      DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY
    ],
    fetchDashboardCharts
  );
}

export function* fetchMissingItems() {
  function* shouldFetchMissingItems() {
    function* getMissingData(name) {
      const previousStepSelector = {
        sources: getSourcesPreviousSteps,
        exporters: getExportersPreviousSteps,
        importers: getImportersPreviousSteps
      };

      // we want to avoid double fetching caused by fetching the tabs,
      // so we set a proper fetch key for panels with tabs
      let previousStep = 'preloaded';

      if (previousStepSelector[name]) {
        previousStep = yield select(previousStepSelector[name]);
      }

      yield put(setFetchKey(previousStep, name));
      yield call(getSectionTabs, name);
    }

    const nodesPanel = yield select(state => state.nodesPanel);
    const selectedContext = yield select(getDashboardsContext);
    const tasks = [];

    if (nodesPanel.countries.selectedNodeId) {
      yield put(setFetchKey(true, 'countries'));
      tasks.push(call(getData, 'countries', nodesPanel.countries));
    }

    if (nodesPanel.commodities.selectedNodeId) {
      yield put(setFetchKey('preloaded', 'commodities'));
      tasks.push(call(getData, 'commodities', nodesPanel.commodities));
    }

    const hasMissingData = name =>
      nodesPanel[name].selectedNodesIds.length > 0 && nodesPanel.sources.data.byId.length === 0;
    if (
      selectedContext &&
      Object.keys(modules)
        .filter(name => !['countries', 'commodities'].includes(name))
        .some(name => hasMissingData(name))
    ) {
      tasks.push(call(getMissingItems, nodesPanel, selectedContext));
    }

    yield all(tasks);

    if (tasks.length > 0 && selectedContext) {
      const subtasks = [];
      Object.keys(modules)
        .filter(name => !['countries', 'commodities'].includes(name))
        .forEach(name => {
          if (hasMissingData(name)) {
            subtasks.push(call(getMissingData, name));
          }
        });
      yield all(subtasks);
      yield call(updateIndicatorsOnItemChange);
    }
    yield put(setDashboardLoading(false));
  }

  yield takeLatest([NODES_PANEL__GET_MISSING_DATA], shouldFetchMissingItems);
}

export default function* dashboardElementSaga() {
  const sagas = [fetchChartsOnIndicatorsChange, fetchChartsOnItemChange];
  if (!ENABLE_REDESIGN_PAGES) sagas.push(fetchMissingItems);
  yield all(sagas.map(saga => fork(saga)));
}
