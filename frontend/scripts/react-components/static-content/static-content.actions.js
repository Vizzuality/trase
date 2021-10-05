import kebabCase from 'lodash/kebabCase';
import { NOT_FOUND, redirect } from 'redux-first-router';
import axios from 'axios';
import { GET_MARKDOWN_CONTENT_URL, getURLFromParams } from 'utils/getURLFromParams';

export const STATIC_CONTENT__SET_MARKDOWN = 'STATIC_CONTENT__SET_MARKDOWN';

export const getStaticContentFilename = ({ type, payload, routesMap }) => {
  const section = payload.section || (routesMap[type] && routesMap[type].default);
  return `${type}/${section && kebabCase(section)}`;
};

export const getStaticContent = () => (dispatch, getState) => {
  const { location, staticContent } = getState();
  const filename = getStaticContentFilename(location);
  const notFound = location.type === NOT_FOUND;
  if (typeof staticContent.markdown[filename] === 'undefined' && !notFound) {
    const url = getURLFromParams(GET_MARKDOWN_CONTENT_URL, { filename });
    axios
      .get(url)
      .then(res => res.data)
      .then(content =>
        dispatch({
          type: STATIC_CONTENT__SET_MARKDOWN,
          payload: { filename, content }
        })
      )
      .catch(err => {
        if (err.status === 404 && !notFound) {
          return dispatch(redirect({ type: NOT_FOUND }));
        }
        return console.error(err.statusText);
      });
  }
};
