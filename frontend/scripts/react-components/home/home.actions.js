import {
  getURLFromParams,
  GET_TWEETS,
  GET_POSTS,
  GET_TESTIMONIALS
} from 'utils/getURLFromParams';

export const HOME__SET_CONTENT = 'HOME__SET_CONTENT';

export const getHomeContent = (type, mock) => (dispatch) => {
  const content = {
    posts: { url: GET_POSTS, defaultValue: [] },
    testimonials: { url: GET_TESTIMONIALS, defaultValue: [] },
    tweets: { url: GET_TWEETS, defaultValue: [] }
  }[type];
  const url = getURLFromParams(content.url, undefined, mock);
  fetch(url)
    .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .then(data => (data[''] ? content.defaultValue : data.data)) // content/twitter may return { "": [] }
    .then(data => dispatch({
      type: HOME__SET_CONTENT,
      payload: { type, data: (data || content.defaultValue) }
    }))
    .catch(err => console.error(err));
};
