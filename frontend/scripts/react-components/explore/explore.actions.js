export const EXPLORE__SET_COMMODITY = 'EXPLORE__SET_COMMODITY';
export const EXPLORE__SET_COUNTRY = 'EXPLORE__SET_COUNTRY';
export const EXPLORE__SELECT_TOP_CARD = 'EXPLORE__SELECT_TOP_CARD';

export const setCommodity = selectedCommodityId => ({
  type: EXPLORE__SET_COMMODITY,
  payload: { selectedCommodityId }
});

export const setCountry = selectedCountryId => ({
  type: EXPLORE__SET_COUNTRY,
  payload: { selectedCountryId }
});

export const goToTool = linkInfo => (dispatch, getState) => {
  const { contexts, selectedContextId } = getState().app;
  let contextId;
  if (!linkInfo) {
    contextId = selectedContextId;
  } else {
    const context = contexts.find(
      c => c.commodityId === linkInfo.commodityId && c.countryId === linkInfo.countryId
    );
    contextId = context.id;
  }
  const serializerParams = { selectedContextId: contextId };
  dispatch({
    type: EXPLORE__SELECT_TOP_CARD,
    payload: { linkInfo }
  });
  dispatch({
    type: 'tool',
    payload: { serializerParams }
  });
};
