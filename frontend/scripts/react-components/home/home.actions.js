import {
  getURLFromParams,
  GET_TWEETS,
  GET_POSTS
} from 'utils/getURLFromParams';

export const HOME__SET_CONTENT = 'HOME__SET_CONTENT';

export const getHomeContent = type => (dispatch) => {
  const params = {
    tweets: GET_TWEETS,
    posts: GET_POSTS
  }[type];
  const url = getURLFromParams(params);
  fetch(url)
    .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .then(data => dispatch({
      type: HOME__SET_CONTENT,
      payload: { data, type }
    }))
    .catch(err => console.error(err));
};
