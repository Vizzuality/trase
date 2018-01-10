import actions from 'actions';

import {
  getURLFromParams,
  GET_TWEETS,
  GET_POSTS
} from 'utils/getURLFromParams';

export const getSliderContent = type => (dispatch) => {
  const params = {
    tweets: GET_TWEETS,
    posts: GET_POSTS
  }[type];
  const url = getURLFromParams(params);
  fetch(url)
    .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .then(data => dispatch({
      type: actions.SET_SLIDER_CONTENT,
      payload: { data, type }
    }))
    .catch(err => console.error(err));
};
