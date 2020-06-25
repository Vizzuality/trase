import { batch } from 'react-redux';
import axios from 'axios';
import {
  GET_TOP_COUNTRIES_FACTS,
  GET_SANKEY_CARD_LINKS,
  getURLFromParams
} from 'utils/getURLFromParams';
import pickBy from 'lodash/pickBy';

export const EXPLORE__SET_COMMODITY = 'EXPLORE__SET_COMMODITY';
export const EXPLORE__SET_COUNTRY = 'EXPLORE__SET_COUNTRY';
export const EXPLORE__SELECT_TOP_CARD = 'EXPLORE__SELECT_TOP_CARD';
export const EXPLORE__SET_QUICK_FACTS = 'EXPLORE__SET_QUICK_FACTS';
export const EXPLORE__SET_SANKEY_CARDS = 'EXPLORE__SET_SANKEY_CARDS';
export const EXPLORE__SET_SANKEY_CARDS_LOADING = 'EXPLORE__SET_SANKEY_CARDS_LOADING';

export const setCommodity = selectedCommodityId => ({
  type: EXPLORE__SET_COMMODITY,
  payload: { selectedCommodityId }
});

export const setCountry = selectedCountryId => ({
  type: EXPLORE__SET_COUNTRY,
  payload: { selectedCountryId }
});

export const setSankeyCardsLoading = loading => ({
  type: EXPLORE__SET_SANKEY_CARDS_LOADING,
  payload: loading
});

export const goToTool = (destination, card) => dispatch => {
  batch(() => {
    // for analytics purpose
    dispatch({
      type: EXPLORE__SELECT_TOP_CARD,
      payload: {
        destination,
        linkParams: card
      }
    });
    const { commodities: commodityId, countries: countryId } = card.links.sankey.payload.serializerParams;
    const serializedParams = `${countryId}-${commodityId}`;
    localStorage.setItem('recentCard', serializedParams);
    dispatch(card.links[destination]);
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

export const getSankeyCards = (level, commodity, country) => dispatch => {
  const url = getURLFromParams(
    GET_SANKEY_CARD_LINKS,
    pickBy({
      level,
      country_id: country?.id,
      commodity_id: commodity?.id
    })
  );
  dispatch(setSankeyCardsLoading(true));
  axios
    .get(url)
    .then(res => {
      const { data, meta } = res.data;
      dispatch({
        type: EXPLORE__SET_SANKEY_CARDS,
        payload: { data, meta }
      });
    })
    .catch(error => console.error(error))
    .finally(() => dispatch(setSankeyCardsLoading(false)));
};
