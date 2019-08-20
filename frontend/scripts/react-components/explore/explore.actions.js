export const EXPLORE__SET_COMMODITY = 'EXPLORE__SET_COMMODITY';
export const EXPLORE__SET_COUNTRY = 'EXPLORE__SET_COUNTRY';
export const EXPLORE__SET_EDIT_MODE = 'EXPLORE__SET_EDIT_MODE';

export const setCommodity = activeCommodityId => ({
  type: EXPLORE__SET_COMMODITY,
  payload: { activeCommodityId }
});

export const setCountry = activeCountryId => ({
  type: EXPLORE__SET_COUNTRY,
  payload: { activeCountryId }
});

export const goToTool = () => dispatch => {
  dispatch({
    type: 'tool'
  });
  dispatch({
    type: 'EXPLORE__SET_EDIT_MODE',
    payload: false
  });
};
