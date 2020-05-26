import { all, fork, takeLatest, select, put, call } from 'redux-saga/effects';
import pick from 'lodash/pick';
import {
  TOOL_LINKS__GET_COLUMNS,
  TOOL_LINKS__SET_SELECTED_NODES,
  TOOL_LINKS__CLEAR_SANKEY,
  TOOL_LINKS__SELECT_COLUMN,
  TOOL_LINKS__SET_SELECTED_NODES_BY_SEARCH
} from 'react-components/tool-links/tool-links.actions';
import {
  TOOL_LAYERS__SET_MAP_DIMENSIONS
} from 'react-components/tool-layers/tool-layers.actions';
import { nodesPanelActions } from 'react-components/nodes-panel/nodes-panel.register';
import { appActions } from 'app/app.register';
import {
  SELECT_YEARS,
  loadMapChoropleth,
  SET_NODE_ATTRIBUTES,
  TOGGLE_MAP_DIMENSION,
  SELECT_UNIT_LAYERS
} from 'react-components/tool/tool.actions';
import {
  getSelectedGeoColumn,
  getSelectedMapDimensionsUids
} from 'react-components/tool-layers/tool-layers.selectors';
import { getSelectedYears, getSelectedContext } from 'app/app.selectors';
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
  function* performFetch({ type }) {
    const selectedYears = yield select(getSelectedYears);
    const selectedContext = yield select(getSelectedContext);
    const { type: page, prev } = yield select(state => state.location);
    if (page !== 'tool' || selectedContext === null) {
      return;
    }

    yield call(getMapDimensions, selectedContext, selectedYears);

    if (type !== appActions.APP__SAGA_REGISTERED || prev.type !== page) {
      // TODO remove this when mapbox comes
      yield put(loadMapChoropleth());
    }
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
    const { toolLayers } = state;
    const { data } = toolLayers;
    const selectedMapDimensions = getSelectedMapDimensionsUids(state);

    const unitIndicators = data.mapDimensions;
    const selectedGeoColumn = yield select(getSelectedGeoColumn);

    if (selectedMapDimensions) {
      const selectedContext = yield select(getSelectedContext);

      const selectedUnitIndicators = pick(unitIndicators, selectedMapDimensions);
      const selectedUnitIndicatorIds = Object.values(selectedUnitIndicators).map(
        value => value.attributeId
      );
      if (selectedContext && selectedUnitIndicatorIds && selectedUnitIndicatorIds.length && selectedGeoColumn) {
        const params = {
          iso2: selectedContext.worldMap.geoId,
          selectedUnitIndicatorIds,
          selectedGeoColumnId: selectedGeoColumn.id
        };
        yield call(getUnitLayerData, params);
      }
    }
  }

  yield takeLatest(
    [
      TOOL_LINKS__SELECT_COLUMN,
      TOOL_LAYERS__SET_MAP_DIMENSIONS,
      SELECT_UNIT_LAYERS
    ],
    performFetch
  );
}

export default function* toolLayersSaga() {
  const sagas = [fetchMapDimensions, fetchLinkedGeoIds, fetchUnitLayerData];
  yield all(sagas.map(saga => fork(saga)));
}
