import {
  LOAD_CONSUMPTION_COUNTRIES,
  LOAD_CONTEXTS,
  LOAD_EXPORTERS,
  LOAD_INDICATORS
} from 'actions/data.actions';
import { createReducer } from 'store';

const initialState = {
  contexts: [],
  exporters: [],
  consumptionCountries: [],
  indicators: []
};

const dataReducer = {
  [LOAD_CONTEXTS](state, action) {
    return Object.assign({}, state, { contexts: action.payload });
  },
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
  contexts: PropTypes.arrayOf(PropTypes.object).isRequired,
  exporters: PropTypes.arrayOf(PropTypes.object).isRequired,
  consumptionCountries: PropTypes.arrayOf(PropTypes.object).isRequired,
  indicators: PropTypes.arrayOf(PropTypes.object).isRequired
});

export default createReducer(initialState, dataReducer, dataReducerTypes);
