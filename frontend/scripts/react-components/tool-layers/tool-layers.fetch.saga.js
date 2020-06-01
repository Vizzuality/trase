import { put, call, cancelled, select } from 'redux-saga/effects';
import {
  getURLFromParams,
  GET_LINKED_GEO_IDS_URL,
  GET_MAP_BASE_DATA_URL
} from 'utils/getURLFromParams';
import { fetchWithCancel } from 'utils/saga-utils';
import {
  setMapDimensions,
  setLinkedGeoIds,
  setUnitLayerData
} from 'react-components/tool-layers/tool-layers.actions';
import intesection from 'lodash/intersection';
import { CARTO_BASE_URL, YEARS_DISABLED_UNAVAILABLE, YEARS_INCOMPLETE } from 'constants';
import { getSingleMapDimensionWarning } from 'app/helpers/getMapDimensionsWarnings';
import { setMapContextLayers } from 'react-components/tool/tool.actions';
import { getSelectedContext, getSelectedYears } from 'app/app.selectors';
import { getSelectedGeoColumn } from 'react-components/tool-layers/tool-layers.selectors';

export function* getLinkedGeoIds() {
  const {
    toolLinks: {
      selectedNodesIds,
      extraColumn,
      data: { nodes }
    }
  } = yield select();
  const selectedYears = yield select(getSelectedYears);
  const selectedContext = yield select(getSelectedContext);
  const selectedGeoColumn = yield select(getSelectedGeoColumn);
  const selectedNonGeoNodeIds = selectedNodesIds.filter(
    nodeId => nodes && nodes[nodeId] && (nodes[nodeId].type === 'COUNTRY' || !nodes[nodeId].geoId)
  );

  // when selection only contains geo nodes (non geo-nodes === 0)
  // and the parent geo column is not selected
  if (selectedNonGeoNodeIds.length === 0 && !extraColumn) {
    yield put(setLinkedGeoIds([]));
    return;
  }

  const params = {
    context_id: selectedContext.id,
    years: Array.from(new Set([selectedYears[0], selectedYears[1]])),
    nodes_ids: selectedNodesIds,
    target_column_id: selectedGeoColumn?.id
  };
  const url = getURLFromParams(GET_LINKED_GEO_IDS_URL, params);
  const { source, fetchPromise } = fetchWithCancel(url);

  try {
    const { data } = yield call(fetchPromise);
    yield put(setLinkedGeoIds(data.nodes));
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (NODE_ENV_DEV) {
        console.error('Cancelled');
      }
      if (source) {
        source.cancel();
      }
    }
  }
}

export function* getMapDimensions(selectedContext, selectedYears) {
  const params = {
    context_id: selectedContext.id,
    start_year: selectedYears[0],
    end_year: selectedYears[1]
  };

  const url = getURLFromParams(GET_MAP_BASE_DATA_URL, params);
  const { source, fetchPromise } = fetchWithCancel(url);

  try {
    const { data } = yield call(fetchPromise);
    const [startYear, endYear] = selectedYears;
    const allSelectedYears = Array(endYear - startYear + 1)
      .fill(startYear)
      .map((year, index) => year + index);

    data.dimensions.forEach(dimension => {
      const allYearsCovered =
        dimension.years === null ||
        dimension.years.length === 0 ||
        allSelectedYears.every(year => dimension.years.includes(year));
      const yearsWithDataToDisplay = intesection(dimension.years, allSelectedYears);
      if (!allYearsCovered && allSelectedYears.length > 1 && yearsWithDataToDisplay.length > 0) {
        dimension.disabledYearRangeReason = YEARS_INCOMPLETE;
        dimension.disabledYearRangeReasonText = getSingleMapDimensionWarning(
          dimension.disabledYearRangeReason,
          yearsWithDataToDisplay,
          dimension.years
        );
      } else if (!allYearsCovered) {
        dimension.disabledYearRangeReason = YEARS_DISABLED_UNAVAILABLE;
        dimension.disabledYearRangeReasonText = getSingleMapDimensionWarning(
          dimension.disabledYearRangeReason,
          yearsWithDataToDisplay,
          dimension.years
        );
      }
    });

    yield put(setMapContextLayers(data.contextualLayers));
    yield put(setMapDimensions(data.dimensions, data.dimensionGroups));
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (NODE_ENV_DEV) {
        console.error('Cancelled');
      }
      if (source) {
        source.cancel();
      }
    }
  }
}

export function* getUnitLayerData(params) {
  const { selectedGeoColumnId, selectedUnitIndicatorIds, iso2 } = params;
  const url = `${CARTO_BASE_URL}/sql?q=
    SELECT node_type_id, node_id, geo_id, attribute_id, json_object_agg(COALESCE(year, 0 ), total
    ORDER BY year) as years FROM (SELECT node_type_id, node_id, geo_id, attribute_id, year,
    SUM(value) AS total FROM map_attributes_values
    WHERE node_type_id = ${selectedGeoColumnId} and attribute_id IN (${selectedUnitIndicatorIds.join(',')}) and iso2 = '${iso2}'
    GROUP BY node_type_id, node_id, geo_id, attribute_id, year) s
    GROUP BY node_type_id, node_id, geo_id, attribute_id ORDER BY geo_id, node_id, attribute_id
  `;
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } =  yield call(fetchPromise);
    yield put(setUnitLayerData(data && data.rows));
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (NODE_ENV_DEV) {
        console.error('Cancelled');
      }
      if (source) {
        source.cancel();
      }
    }
  }
}
