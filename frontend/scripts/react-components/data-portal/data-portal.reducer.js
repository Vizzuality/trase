import {
<<<<<<< HEAD
  DATA_PORTAL__SET_SELECTED_COUNTRY_ID,
  DATA_PORTAL__SET_SELECTED_COMMODITY_ID,
  DATA_PORTAL__LOAD_CONSUMPTION_COUNTRIES,
  DATA_PORTAL__LOAD_EXPORTERS,
  DATA_PORTAL__LOAD_INDICATORS
=======
  LOAD_CONSUMPTION_COUNTRIES,
  LOAD_EXPORTERS,
  LOAD_INDICATORS
>>>>>>> moves everything under one react root
} from 'react-components/data-portal/data-portal.actions';
import createReducer from 'utils/createReducer';
import immer from 'immer';

const initialState = {
  country: null,
  commodity: null,
  exporters: [],
  consumptionCountries: [],
  indicators: []
};

const dataPortalReducer = {
  [DATA_PORTAL__SET_SELECTED_COUNTRY_ID](state, action) {
    return immer(state, draft => {
      Object.assign(draft, initialState);
      draft.country = action.payload;
    });
  },
  [DATA_PORTAL__SET_SELECTED_COMMODITY_ID](state, action) {
    return immer(state, draft => {
      draft.commodity = action.payload;
      draft.exporters = initialState.exporters;
      draft.indicators = initialState.indicators;
      draft.consumptionCountries = initialState.consumptionCountries;
    });
  },
  [DATA_PORTAL__LOAD_EXPORTERS](state, action) {
    return immer(state, draft => {
      draft.exporters = action.exporters;
    });
  },
  [DATA_PORTAL__LOAD_CONSUMPTION_COUNTRIES](state, action) {
    return immer(state, draft => {
      draft.consumptionCountries = action.consumptionCountries;
    });
  },
  [DATA_PORTAL__LOAD_INDICATORS](state, action) {
    return immer(state, draft => {
      draft.indicators = action.indicators;
    });
  }
};

const dataReducerTypes = PropTypes => ({
  exporters: PropTypes.arrayOf(PropTypes.object).isRequired,
  consumptionCountries: PropTypes.arrayOf(PropTypes.object).isRequired,
  indicators: PropTypes.arrayOf(PropTypes.object).isRequired
});

export default createReducer(initialState, dataPortalReducer, dataReducerTypes);
