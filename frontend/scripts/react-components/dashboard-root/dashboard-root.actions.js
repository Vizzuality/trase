import { getURLFromParams, GET_DASHBOARD_TEMPLATES_URL } from 'scripts/utils/getURLFromParams';

export const DASHBOARD_ROOT__SET_DASHBOARD_TEMPLATES = 'DASHBOARD_ROOT__SET_DASHBOARD_TEMPLATES';
export const DASHBOARD_ROOT__SET_LOADING_DASHBOARD_TEMPLATES =
  'DASHBOARD_ROOT__SET_LOADING_DASHBOARD_TEMPLATES';

export const getDashboardTemplates = mock => dispatch => {
  const url = getURLFromParams(GET_DASHBOARD_TEMPLATES_URL, undefined, mock);
  fetch(url)
    .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .then(data => (data[''] ? [] : data.data)) // content/twitter may return { "": [] }
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
