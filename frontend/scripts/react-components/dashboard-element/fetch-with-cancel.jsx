import axios, { CancelToken } from 'axios';

export function fetchWithCancel(url) {
  const source = CancelToken.source();

  const fetchPromise = () =>
    axios.get(url, {
      cancelToken: source.token
    });

  return { fetchPromise, source };
}
