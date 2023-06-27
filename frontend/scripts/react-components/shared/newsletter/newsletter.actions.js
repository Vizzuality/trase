import { getURLFromParams, POST_SUBSCRIBE_NEWSLETTER_URL } from 'utils/getURLFromParams';
import axios from 'axios';

export const NEWSLETTER__SET_SUBSCRIPTION_MESSAGE = 'NEWSLETTER__SET_SUBSCRIPTION_MESSAGE';
export const NEWSLETTER__RESET_NEWSLETTER = 'NEWSLETTER__RESET_NEWSLETTER';

export const sendSubscriptionEmail = ({
  email,
  firstname,
  lastname,
  organisation,
  country,
  subscribe,
  source,
  traseType,
  traseUse,
  traseWork
}) => dispatch => {
  const body = new FormData();
  body.append('email', email);
  body.append('firstname', firstname);
  body.append('lastname', lastname);
  body.append('organisation', organisation);
  body.append('country', country);
  body.append('subscribe', subscribe);
  body.append('source', source);
  body.append('trase_type', traseType);
  body.append('trase_use', traseUse);
  body.append('trase_work', traseWork);

  const url = getURLFromParams(POST_SUBSCRIBE_NEWSLETTER_URL);
  return axios
    .post(url, body)
    .then(res => res.data)
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
    .catch(error => {
      const message = `Error: ${error?.response?.data?.error || error}`;
      dispatch({
        type: NEWSLETTER__SET_SUBSCRIPTION_MESSAGE,
        payload: { message }
      });
    });
};

export const resetNewsletter = () => ({
  type: NEWSLETTER__RESET_NEWSLETTER
});
