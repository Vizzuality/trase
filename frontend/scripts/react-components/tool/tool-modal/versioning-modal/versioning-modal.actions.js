import { getURLFromParams, GET_METHODS_AND_DATA_URL } from 'scripts/utils/getURLFromParams';
import axios from 'axios';

export const VERSIONING_MODAL__SET_METHODS_AND_DATA_URL =
  'VERSIONING_MODAL__SET_METHODS_AND_DATA_URL';

export const getMethodsAndData = () => dispatch => {
  const url = getURLFromParams(GET_METHODS_AND_DATA_URL, undefined);
  axios
    .get(url)
    .then(res => res.data)
    .then(data => data.data)
    .then(data => {
      dispatch({
        type: VERSIONING_MODAL__SET_METHODS_AND_DATA_URL,
        payload: data
      });
    })
    .catch(err => console.error(err));
};
