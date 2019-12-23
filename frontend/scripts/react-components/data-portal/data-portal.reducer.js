import {
  LOAD_CONSUMPTION_COUNTRIES,
  LOAD_EXPORTERS,
  LOAD_INDICATORS
} from 'react-components/data-portal/data-portal.actions';
import createReducer from 'utils/createReducer';

const initialState = {
  exporters: [],
  consumptionCountries: [],
  indicators: []
};

const dataPortalReducer = {
  [LOAD_EXPORTERS](state, action) {
    return Object.assign({}, state, { exporters: action.exporters });
  },
  [LOAD_CONSUMPTION_COUNTRIES](state, action) {
    return Object.assign({}, state, { consumptionCountries: action.consumptionCountries });
  },
  [LOAD_INDICATORS](state, action) {
    return Object.assign({}, state, { indicators: action.indicators });
  }
};

const dataReducerTypes = PropTypes => ({
  exporters: PropTypes.arrayOf(PropTypes.object).isRequired,
  consumptionCountries: PropTypes.arrayOf(PropTypes.object).isRequired,
  indicators: PropTypes.arrayOf(PropTypes.object).isRequired
});

export default createReducer(initialState, dataPortalReducer, dataReducerTypes);
