import { put, delay } from 'redux-saga/effects';

export function* setLoadingSpinner(timeout, action) {
  try {
    yield delay(timeout);
    yield put(action);
  } catch (e) {
    console.error(e);
  }
}
