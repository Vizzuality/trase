import { getURLFromParams, POST_SUBSCRIBE_NEWSLETTER } from 'utils/getURLFromParams';

export const NEWSLETTER__SET_SUBSCRIPTION_MESSAGE = 'NEWSLETTER__SET_SUBSCRIPTION_MESSAGE';
export const NEWSLETTER__RESET_NEWSLETTER = 'NEWSLETTER__RESET_NEWSLETTER';

export const sendSubscriptionEmail = email => dispatch => {
  const body = new FormData();
  body.append('email', email);

  const url = getURLFromParams(POST_SUBSCRIBE_NEWSLETTER);
  return fetch(url, {
    method: 'POST',
    body
  })
    .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .then(data => {
      if (data.error) return Promise.reject(new Error(data.error));
      return Promise.resolve('Subscription successful');
    })
    .then(message =>
      dispatch({
        type: NEWSLETTER__SET_SUBSCRIPTION_MESSAGE,
        payload: { message }
      })
    )
    .catch(error =>
      dispatch({
        type: NEWSLETTER__SET_SUBSCRIPTION_MESSAGE,
        payload: { message: `Error: ${error}` }
      })
    );
};

export const resetNewsletter = () => ({
  type: NEWSLETTER__RESET_NEWSLETTER
});
