import { getURLFromParams, GET_DASHBOARD_TEMPLATES_URL } from 'scripts/utils/getURLFromParams';
import axios from 'axios';

export const DASHBOARD_ROOT__SET_DASHBOARD_TEMPLATES = 'DASHBOARD_ROOT__SET_DASHBOARD_TEMPLATES';
export const DASHBOARD_ROOT__SET_LOADING_DASHBOARD_TEMPLATES =
  'DASHBOARD_ROOT__SET_LOADING_DASHBOARD_TEMPLATES';

export const getDashboardTemplates = mock => dispatch => {
  const url = getURLFromParams(GET_DASHBOARD_TEMPLATES_URL, undefined, mock);
  axios
    .get(url)
    .then(res => res.data)
    .then(data => data.data) // content/twitter may return { "": [] }
    .then(data => {
      dispatch({
        type: DASHBOARD_ROOT__SET_DASHBOARD_TEMPLATES,
        payload: data || []
      });
      dispatch({
        type: DASHBOARD_ROOT__SET_LOADING_DASHBOARD_TEMPLATES,
        payload: false
      });
    })
    .catch(err => console.error(err));
};
