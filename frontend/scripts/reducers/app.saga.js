import { select, fork, takeLatest, cancel, all } from 'redux-saga/effects';
import {
  SET_CONTEXT,
  SET_CONTEXTS,
  APP__GET_COLUMNS,
  setColumnsLoading
} from 'actions/app.actions';
import { setLoadingSpinner } from 'utils/saga-utils';
import { getSelectedContext } from 'reducers/app.selectors';
import { getColumnsData } from 'reducers/app.fetch.saga';

function* fetchColumns() {
  function* findSelectedContext(location, contexts) {
    switch (location.type) {
      case 'profileNode': {
        const { contextId } = location.query;
        return contextId ? contexts.find(c => c.id === contextId) : null;
      }
      case 'dashboardElement': {
        const { selectedCountryId, selectedCommodityId } = location.query;
        if (!selectedCountryId || !selectedCommodityId) return null;
        return contexts.find(
          c => c.countryId === selectedCountryId && c.commodityId === selectedCommodityId
        );
      }
      case 'explore':
      case 'tool':
        return yield select(getSelectedContext);
      default:
        return null;
    }
  }

  function* performFetch() {
    const {
      location,
      app: { contexts }
    } = yield select();
    const selectedContext = yield findSelectedContext(location, contexts);
    if (selectedContext === null) return;
    const task = yield fork(setLoadingSpinner, 750, setColumnsLoading(true));
    yield fork(getColumnsData, selectedContext);

    if (task.isRunning()) {
      yield cancel(task);
    } else {
      yield fork(setLoadingSpinner, 350, setColumnsLoading(false));
    }
  }
  yield takeLatest([SET_CONTEXTS, APP__GET_COLUMNS, SET_CONTEXT], performFetch);
}

export default function* appSaga() {
  const sagas = [fetchColumns];
  yield all(sagas.map(saga => fork(saga)));
}
