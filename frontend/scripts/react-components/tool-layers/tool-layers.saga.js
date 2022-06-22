import { all, fork, takeLatest, select, put, call } from 'redux-saga/effects';
import {
  TOOL_LINKS__GET_COLUMNS,
  TOOL_LINKS__SET_SELECTED_NODES,
  TOOL_LINKS__CLEAR_SANKEY,
  TOOL_LINKS__SELECT_COLUMN,
  TOOL_LINKS__SET_SELECTED_NODES_BY_SEARCH
} from 'react-components/tool-links/tool-links.actions';
import { TOOL_LAYERS__SET_MAP_DIMENSIONS } from 'react-components/tool-layers/tool-layers.actions';
import { nodesPanelActions } from 'react-components/nodes-panel/nodes-panel.register';
import { appActions } from 'app/app.register';
import {
  SELECT_YEARS,
  loadMapChoropleth,
  SET_NODE_ATTRIBUTES,
  TOGGLE_MAP_DIMENSION,
  SELECT_UNIT_LAYERS,
  selectContextualLayers,
  selectUnitLayers,
  selectLogisticLayers,
  resetSelectedMapDimensions
} from 'react-components/tool/tool.actions';
import {
  getSelectedGeoColumn,
  getSelectedMapDimensionsUids
} from 'react-components/tool-layers/tool-layers.selectors';
import { getSelectedYears, getSelectedContext } from 'app/app.selectors';
import { NODES_PANEL__FINISH_SELECTION } from 'react-components/nodes-panel/nodes-panel.actions';
import { getLinkedGeoIds, getMapDimensions, getUnitLayerData } from './tool-layers.fetch.saga';

function* fetchLinkedGeoIds() {
  function* getGeoIds() {
    yield fork(getLinkedGeoIds);
  }

  yield takeLatest(
    [
      TOOL_LINKS__SET_SELECTED_NODES,
      TOOL_LINKS__CLEAR_SANKEY,
      TOOL_LINKS__SELECT_COLUMN,
      TOOL_LINKS__SET_SELECTED_NODES_BY_SEARCH,
      SET_NODE_ATTRIBUTES
    ],
    getGeoIds
  );
}

function* fetchMapDimensions() {
  function* performFetch() {
    const selectedYears = yield select(getSelectedYears);
    const selectedContext = yield select(getSelectedContext);
    const { type: page } = yield select(state => state.location);
    if (page !== 'tool' || selectedContext === null) {
      return;
    }

    yield call(getMapDimensions, selectedContext, selectedYears);
    console.log('loadMapChoropleth');
    yield put(loadMapChoropleth());
  }
  yield takeLatest(
    [
      appActions.SET_CONTEXTS,
      TOOL_LINKS__GET_COLUMNS,
      TOGGLE_MAP_DIMENSION,
      appActions.SET_CONTEXT,
      nodesPanelActions.NODES_PANEL__SAVE,
      SELECT_YEARS,
      TOOL_LINKS__SELECT_COLUMN,
      TOOL_LINKS__CLEAR_SANKEY,
      nodesPanelActions.NODES_PANEL__SYNC_NODES_WITH_SANKEY,
      appActions.APP__SAGA_REGISTERED
    ],
    performFetch
  );
}

function* fetchUnitLayerData() {
  function* performFetch() {
    const state = yield select();
    const selectedMapDimensions = getSelectedMapDimensionsUids(state);

    const selectedGeoColumn = yield select(getSelectedGeoColumn);

    if (selectedMapDimensions) {
      const selectedContext = yield select(getSelectedContext);

      if (selectedContext && selectedGeoColumn) {
        const params = {
          iso2: selectedContext.worldMap.geoId,
          selectedGeoColumnId: selectedGeoColumn.id
        };
        yield call(getUnitLayerData, params);
      }
    }
  }

  yield takeLatest(
    [TOOL_LINKS__SELECT_COLUMN, TOOL_LAYERS__SET_MAP_DIMENSIONS, SELECT_UNIT_LAYERS],
    performFetch
  );
}

function* resetContextLayers() {
  const previousContext = { countryId: null, commodityId: null };

  function* performReset() {
    const { contexts } = yield select(state => state.app);
    const { countries, commodities } = yield select(state => state.nodesPanel);
    const context = contexts.find(
      ctx =>
        ctx.countryId === countries.draftSelectedNodeId &&
        ctx.commodityId === commodities.draftSelectedNodeId
    );

    if (
      countries.draftSelectedNodeId !== previousContext.countryId ||
      commodities.draftSelectedNodeId !== previousContext.commodityId
    ) {
      yield put(selectContextualLayers([]));
      yield put(selectLogisticLayers([]));
      yield put(selectUnitLayers([]));
      yield put(resetSelectedMapDimensions());
    }
    // we update the previous context
    previousContext.countryId = context.countryId;
    previousContext.commodityId = context.commodityId;
  }

  yield takeLatest([NODES_PANEL__FINISH_SELECTION], performReset);
}

export default function* toolLayersSaga() {
  const sagas = [fetchMapDimensions, fetchLinkedGeoIds, fetchUnitLayerData, resetContextLayers];
  yield all(sagas.map(saga => fork(saga)));
}
