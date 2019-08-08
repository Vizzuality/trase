export const TOOL_SELECTOR__SET_COMMODITY = 'TOOL_SELECTOR__SET_COMMODITY';
export const TOOL_SELECTOR__SET_COUNTRY = 'TOOL_SELECTOR__SET_COUNTRY';

export const setCommodity = activeCommodityId => ({
  type: TOOL_SELECTOR__SET_COMMODITY,
  payload: { activeCommodityId }
});

export const setCountry = activeCountryId => ({
  type: TOOL_SELECTOR__SET_COUNTRY,
  payload: { activeCountryId }
});
