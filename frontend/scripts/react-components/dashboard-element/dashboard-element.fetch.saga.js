import pickBy from 'lodash/pickBy';
import { put, call, cancelled, select } from 'redux-saga/effects';
import {
  setDashboardLoading,
  DASHBOARD_ELEMENT__SET_CHARTS
} from 'react-components/dashboard-element/dashboard-element.actions';
import {
  getDashboardSelectedYears,
  getDashboardSelectedResizeBy,
  getDashboardSelectedRecolorBy
} from 'react-components/dashboard-element/dashboard-element.selectors';
import { getURLFromParams, GET_DASHBOARD_PARAMETRISED_CHARTS_URL } from 'utils/getURLFromParams';
import { fetchWithCancel, setLoadingSpinner } from 'utils/saga-utils';
import { getPanelParams } from 'react-components/nodes-panel/nodes-panel.fetch.saga';

export function* fetchDashboardCharts() {
  const selectedResizeBy = yield select(getDashboardSelectedResizeBy);
  const selectedRecolorBy = yield select(getDashboardSelectedRecolorBy);
  const selectedYears = yield select(getDashboardSelectedYears);

  const {
    countries_ids: countryId,
    commodities_ids: commodityId,
    ...options
  } = yield getPanelParams(null, { isOverview: true });

  const params = pickBy(
    {
      ...options,
      country_id: countryId,
      commodity_id: commodityId,
      cont_attribute_id: selectedResizeBy?.attributeId,
      ncont_attribute_id: selectedRecolorBy?.attributeId,
      start_year: selectedYears[0],
      end_year: selectedYears[1]
    },
    x => !!x
  );

  if (!params.commodity_id || !params.country_id || !params.start_year || !params.end_year) {
    return;
  }
  const url = getURLFromParams(GET_DASHBOARD_PARAMETRISED_CHARTS_URL, params);

  yield put(setDashboardLoading(true));
  const { source, fetchPromise } = fetchWithCancel(url);
  try {
    const { data } = yield call(fetchPromise);
    yield put({
      type: DASHBOARD_ELEMENT__SET_CHARTS,
      payload: { charts: data }
    });
  } catch (e) {
    console.error('Error', e);
  } finally {
    if (yield cancelled()) {
      if (NODE_ENV_DEV) {
        console.error('Cancelled', params);
      }
      if (source) {
        source.cancel();
      }
    }
    yield call(setLoadingSpinner, 750, setDashboardLoading(false));
  }
}
