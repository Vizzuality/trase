import camelCase from 'lodash/camelCase';

export const STATIC_CONTENT__SET_MARKDOWN = 'STATIC_CONTENT__SET_MARKDOWN';

export const getStaticContentFilename = location => camelCase(
  location.type + (location.payload.section || '')
);

export const getStaticContent = () => (dispatch, getState) => {
  const { location, staticContent } = getState();
  const filename = getStaticContentFilename(location);
  if (typeof staticContent.markdown[filename] === 'undefined') {
    const url = `/static-content/${filename}.md`;
    fetch(url)
      .then(res => (res.ok ? res.text() : Promise.reject(res.statusText)))
      .then(content => dispatch({
        type: STATIC_CONTENT__SET_MARKDOWN,
        payload: { filename, content }
      }))
      .catch(err => console.error(err));
  }
};
