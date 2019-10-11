import {
  getURLFromParams,
  GET_TWEETS_URL,
  GET_POSTS_URL,
  GET_TESTIMONIALS_URL
} from 'utils/getURLFromParams';

import { HOME_VIDEO } from 'constants';

export const HOME__SET_CONTENT = 'HOME__SET_CONTENT';
export const HOME__PLAY_VIDEO = 'HOME__PLAY_VIDEO';
export const HOME__CLICK_ENTRYPOINT = 'HOME__CLICK_ENTRYPOINT';
export const HOME__CLICK_NEXT_ENTRYPOINT = 'HOME__CLICK_NEXT_ENTRYPOINT';

export const getHomeContent = (type, mock) => dispatch => {
  const content = {
    posts: { url: GET_POSTS_URL, defaultValue: [] },
    testimonials: { url: GET_TESTIMONIALS_URL, defaultValue: [] },
    tweets: { url: GET_TWEETS_URL, defaultValue: [] }
  }[type];
  const url = getURLFromParams(content.url, undefined, mock);
  fetch(url)
    .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .then(data => (data[''] ? content.defaultValue : data.data)) // content/twitter may return { "": [] }
    .then(data =>
      dispatch({
        type: HOME__SET_CONTENT,
        payload: { type, data: data || content.defaultValue }
      })
    )
    .catch(err => console.error(err));
};

export const playHomeVideo = videoId => {
  const [lang] = Object.entries(HOME_VIDEO).find(entry => entry[1] === videoId);
  return {
    type: HOME__PLAY_VIDEO,
    payload: lang
  };
};

export const clickEntrypoint = link => ({
  type: HOME__CLICK_ENTRYPOINT,
  payload: link
});

export const clickNextEntrypoint = () => ({
  type: HOME__CLICK_NEXT_ENTRYPOINT
});
