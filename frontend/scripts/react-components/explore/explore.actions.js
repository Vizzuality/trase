import { batch } from 'react-redux';
import axios from 'axios';
import { GET_TOP_COUNTRIES_FACTS, getURLFromParams } from 'utils/getURLFromParams';

export const EXPLORE__SET_COMMODITY = 'EXPLORE__SET_COMMODITY';
export const EXPLORE__SET_COUNTRY = 'EXPLORE__SET_COUNTRY';
export const EXPLORE__SELECT_TOP_CARD = 'EXPLORE__SELECT_TOP_CARD';
export const EXPLORE__SET_QUICK_FACTS = 'EXPLORE__SET_QUICK_FACTS';

export const setCommodity = selectedCommodityId => ({
  type: EXPLORE__SET_COMMODITY,
  payload: { selectedCommodityId }
});

export const setCountry = selectedCountryId => ({
  type: EXPLORE__SET_COUNTRY,
  payload: { selectedCountryId }
});

export const goToTool = (destination, linkInfo) => (dispatch, getState) => {
  const { contexts } = getState().app;
  const context = contexts.find(
    c => c.commodityId === linkInfo.commodityId && c.countryId === linkInfo.countryId
  );

  batch(() => {
    // for analytics purpose
    dispatch({
      type: EXPLORE__SELECT_TOP_CARD,
      payload: {
        linkParams: {
          countryName: context.countryName,
          commodityName: context.commodityName,
          nodeTypeName: linkInfo.nodeTypeName,
          indicatorName: linkInfo.indicatorName
        }
      }
    });

    if (destination === 'sankey') {
      const serializerParams = {
        selectedContextId: context.id,
        selectedRecolorBy: linkInfo.indicatorId
      };

      dispatch({ type: 'tool', payload: { serializerParams } });
    } else {
      const serializerParams = {
        selectedCountryId: context.countryId,
        selectedCommodityId: context.commodityId,
        selectedRecolorBy: linkInfo.indicatorId
      };

      dispatch({
        type: 'dashboardElement',
        payload: { dashboardId: 'new', serializerParams }
      });
    }
  });
};

export const getQuickFacts = commodityId => dispatch => {
  const url = getURLFromParams(GET_TOP_COUNTRIES_FACTS, { commodity_id: commodityId });
  axios
    .get(url)
    .then(res => {
      const { data, meta } = res.data;
      dispatch({
        type: EXPLORE__SET_QUICK_FACTS,
        payload: {
          data,
          meta
        }
      });
    })
    .catch(error => console.error(error));
};
