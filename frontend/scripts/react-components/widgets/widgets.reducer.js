import createReducer from 'utils/createReducer';
import camelCase from 'lodash/camelCase';
import {
  WIDGETS__SET_ENDPOINT_DATA,
  WIDGETS__SET_ENDPOINT_ERROR,
  WIDGETS__SET_ENDPOINT_LOADING
} from './widgets.actions';

const initialState = {
  endpoints: {
    /**
     * { [endpoint]: { data, error, loading } }
     */
  }
};

const defaultEndpoint = { data: {}, loading: true, error: null };

const widgetsReducer = {
  [WIDGETS__SET_ENDPOINT_DATA](state, action) {
    const { endpoint, data } = action.payload;
    const camelCaseData = Object.entries(data).reduce(
      (acc, [key, value]) => ({ ...acc, [camelCase(key)]: value }),
      {}
    );
    return {
      ...state,
      endpoints: {
        ...state.endpoints,
        [endpoint]: {
          ...defaultEndpoint,
          ...state.endpoints[endpoint],
          data: camelCaseData
        }
      }
    };
  },
  [WIDGETS__SET_ENDPOINT_LOADING](state, action) {
    const { endpoint, loading } = action.payload;
    return {
      ...state,
      endpoints: {
        ...state.endpoints,
        [endpoint]: {
          ...defaultEndpoint,
          ...state.endpoints[endpoint],
          loading
        }
      }
    };
  },
  [WIDGETS__SET_ENDPOINT_ERROR](state, action) {
    const { endpoint, error } = action.payload;
    return {
      ...state,
      endpoints: {
        ...state.endpoints,
        [endpoint]: {
          ...defaultEndpoint,
          ...state.endpoints[endpoint],
          error
        }
      }
    };
  }
};

const widgetsReducerTypes = PropTypes => ({
  endpoints: PropTypes.object.isRequired
});

export default createReducer(initialState, widgetsReducer, widgetsReducerTypes);
