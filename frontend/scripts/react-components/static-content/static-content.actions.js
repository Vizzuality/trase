import { NOT_FOUND, redirect } from 'redux-first-router';
import { getURLFromParams, GET_MARKDOWN_CONTENT_URL, GET_TEAM_URL } from 'utils/getURLFromParams';
import kebabCase from 'lodash/kebabCase';

export const STATIC_CONTENT__SET_MARKDOWN = 'STATIC_CONTENT__SET_MARKDOWN';
export const STATIC_CONTENT__SET_TEAM = 'STATIC_CONTENT__SET_TEAM';

export const getStaticContentFilename = ({ type, payload }) =>
  `${type}${payload.section ? `/${kebabCase(payload.section)}` : ''}`;

export const getStaticContent = () => (dispatch, getState) => {
  const { location, staticContent } = getState();
  const filename = getStaticContentFilename(location);
  const notFound = location.type === NOT_FOUND;
  if (typeof staticContent.markdown[filename] === 'undefined' && !notFound) {
    const url = getURLFromParams(GET_MARKDOWN_CONTENT_URL, { filename });
    fetch(url)
      .then(res => (res.ok ? res.text() : Promise.reject(res)))
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

export const getTeamData = mock => (dispatch, getState) => {
  const { groups, members } = getState().staticContent;
  if (!groups || !members) {
    const url = getURLFromParams(GET_TEAM_URL, null, mock);
    fetch(url)
      .then(res => (res.ok ? res.json() : Promise.reject(res)))
      .then(({ data }) =>
        dispatch({
          type: STATIC_CONTENT__SET_TEAM,
          payload: { data }
        })
      )
      .catch(err => console.error(err.statusText));
  }
};
