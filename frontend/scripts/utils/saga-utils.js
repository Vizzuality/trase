import axios, { CancelToken } from 'axios';
import { put, delay } from 'redux-saga/effects';

export function fetchWithCancel(url) {
  const source = CancelToken.source();

  const fetchPromise = () =>
    axios.get(url, {
      cancelToken: source.token
    });

  return { fetchPromise, source };
}

export function* setLoadingSpinner(timeout, action) {
  try {
    yield delay(timeout);
    yield put(action);
  } catch (e) {
    console.error(e);
  }
}
