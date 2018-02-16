import { redirect } from 'redux-first-router';

export const setLocaleCode = code => (dispatch, getState) => {
  const { type, query = {}, payload } = getState().location;
  dispatch(
    redirect({
      type,
      payload: {
        ...payload,
        query: { ...query, lang: code }
      }
    })
  );
};
