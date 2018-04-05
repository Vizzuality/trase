import { redirect } from 'redux-first-router';

export const setLocaleCode = code => (dispatch, getState) => {
  const { location } = getState();
  const { type, query = {}, payload } = location;
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
