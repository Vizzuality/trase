import {
  getURLFromParams,
  GET_DASHBOARD_OPTIONS_TABS_URL,
  GET_ALL_NODES_URL
} from 'utils/getURLFromParams';
import { getDataDownloadContext } from 'react-components/data-portal/data-portal.selectors';
import axios from 'axios';
import { batch } from 'react-redux';

export const DATA_PORTAL__SET_SELECTED_COUNTRY_ID = 'DATA_PORTAL__SET_SELECTED_COUNTRY_ID';
export const DATA_PORTAL__SET_SELECTED_COMMODITY_ID = 'DATA_PORTAL__SET_SELECTED_COMMODITY_ID';
export const DATA_PORTAL__LOAD_EXPORTERS = 'DATA_PORTAL__LOAD_EXPORTERS';
export const DATA_PORTAL__LOAD_CONSUMPTION_COUNTRIES = 'DATA_PORTAL__LOAD_CONSUMPTION_COUNTRIES';
export const DATA_PORTAL__LOAD_INDICATORS = 'DATA_PORTAL__LOAD_INDICATORS';

export const setSelectedCountryId = countryId => ({
  type: DATA_PORTAL__SET_SELECTED_COUNTRY_ID,
  payload: countryId
});

export const setSelectedCommodityId = commodityId => ({
  type: DATA_PORTAL__SET_SELECTED_COMMODITY_ID,
  payload: commodityId
});

export const loadDataDownloadLists = () => (dispatch, getState) => {
  const state = getState();
  const selectedContext = getDataDownloadContext(state);

  const contextFiltersURL = getURLFromParams(GET_DASHBOARD_OPTIONS_TABS_URL, {
    country_id: selectedContext.countryId,
    commodity_id: selectedContext.commodityId
  });

  axios
    .get(contextFiltersURL)
    .then(res => res.data)
    .then(({ data }) => {
      const columnIds = {};
      data.forEach(item => {
        const tab = item.tabs.find(t => ['EXPORTER', 'COUNTRY'].includes(t.name));
        if (tab) {
          columnIds[tab.name] = tab.id;
        }
      });

      const exportersURL = getURLFromParams(GET_ALL_NODES_URL, {
        context_id: selectedContext.id,
        node_types_ids: columnIds.EXPORTER
      });

      const destinationsURL = getURLFromParams(GET_ALL_NODES_URL, {
        context_id: selectedContext.id,
        node_types_ids: columnIds.COUNTRY
      });

      Promise.all([exportersURL, destinationsURL].map(url => axios.get(url))).then(responses => {
        const [exporters, destinations] = responses.map(res => res.data.data);

        batch(() => {
          dispatch({
            type: DATA_PORTAL__LOAD_EXPORTERS,
            exporters
          });

          dispatch({
            type: DATA_PORTAL__LOAD_CONSUMPTION_COUNTRIES,
            consumptionCountries: destinations
          });
        });
      });
    });
};
