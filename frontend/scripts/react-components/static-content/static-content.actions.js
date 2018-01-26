import { NOT_FOUND, redirect } from 'redux-first-router';
import camelCase from 'lodash/camelCase';
import { getURLFromParams, GET_MARKDOWN_CONTENT } from 'utils/getURLFromParams';

export const STATIC_CONTENT__SET_MARKDOWN = 'STATIC_CONTENT__SET_MARKDOWN';

export const getStaticContentFilename = location => camelCase(
  `${location.type} ${(location.payload.section || '')}`
);

export const getStaticContent = () => (dispatch, getState) => {
  const { location, staticContent } = getState();
  const filename = getStaticContentFilename(location);
  const notFound = location.type === NOT_FOUND;
  if (
    typeof staticContent.markdown[filename] === 'undefined' &&
    !notFound
  ) {
    const url = getURLFromParams(GET_MARKDOWN_CONTENT, { filename });
    fetch(url)
      .then(res => (res.ok ? res.text() : Promise.reject(res)))
      .then(content => dispatch({
        type: STATIC_CONTENT__SET_MARKDOWN,
        payload: { filename, content }
      }))
      .catch((err) => {
        if (err.status === 404 && !notFound) {
          return dispatch(redirect({ type: NOT_FOUND }));
        }
        return console.error(err.statusText);
      });
  }
};
