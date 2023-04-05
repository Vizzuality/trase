import { getURLFromParams, POST_SUBSCRIBE_NEWSLETTER_URL } from 'utils/getURLFromParams';
import axios from 'axios';

export const NEWSLETTER__SET_SUBSCRIPTION_MESSAGE = 'NEWSLETTER__SET_SUBSCRIPTION_MESSAGE';
export const NEWSLETTER__RESET_NEWSLETTER = 'NEWSLETTER__RESET_NEWSLETTER';

// eslint-disable-next-line camelcase
export const sendSubscriptionEmail = ({ email, firstname, country, organisation, traseType: trase_type, traseUse: trase_use, traseWork: trase_work }) => dispatch => {
  const body = new FormData();
  body.append('email', email);
  body.append('firstname', firstname);
  body.append('country', country);
  body.append('organisation', organisation);
  body.append('trase_type', trase_type);
  body.append('trase_use', trase_use);
  body.append('trase_work', trase_work);
  const url = getURLFromParams(POST_SUBSCRIBE_NEWSLETTER_URL);
  return axios
    .post(url, body)
    .then(res => res.data)
    .then(data => {
      if (data.error) return Promise.reject(new Error(data.error));
      return Promise.resolve('Subscription successful');
    })
    .then(message => dispatch({
        type: NEWSLETTER__SET_SUBSCRIPTION_MESSAGE,
        payload: { message }
      })
    )
    .catch(error => dispatch({
        type: NEWSLETTER__SET_SUBSCRIPTION_MESSAGE,
        payload: { message: `Error: ${error}` }
      })
    );
};

export const resetNewsletter = () => ({
  type: NEWSLETTER__RESET_NEWSLETTER
});
