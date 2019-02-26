import { runSaga } from 'redux-saga';

export async function recordSaga(saga, initialAction, state) {
  const dispatched = [];

  await runSaga(
    {
      dispatch: action => dispatched.push(action),
      getState: () => state
    },
    saga,
    initialAction
  ).done;
  dispatched._saga = saga;
  return dispatched;
}
