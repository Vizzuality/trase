import { redirect } from 'redux-first-router';

export const setLocaleCode = code => (dispatch, getState) => {
  const { type, payload } = getState().location;
  dispatch(
    redirect({
      type,
      payload: {
        ...payload,
        query: { ...(payload ? payload.query : {}), lang: code }
      }
    })
  );
};
