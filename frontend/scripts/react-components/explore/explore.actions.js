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

export const goToTool = linkInfo => (dispatch, getState) => {
  const { contexts } = getState().app;
  const context = contexts.find(
    c => c.commodityId === linkInfo.commodityId && c.countryId === linkInfo.countryId
  );
  const serializerParams = { selectedContextId: context?.id };
  dispatch({
    type: 'tool',
    payload: { serializerParams }
  });
  dispatch({
    type: 'EXPLORE__SET_EDIT_MODE',
    payload: false
  });
};
