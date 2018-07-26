import createReducer from 'utils/createReducer';
import camelCase from 'lodash/camelCase';
import {
  WIDGETS__INIT_ENDPOINT,
  WIDGETS__SET_ENDPOINT_DATA,
  WIDGETS__SET_ENDPOINT_ERROR,
  WIDGETS__SET_ENDPOINT_LOADING
} from './widgets.actions';

const initialState = {
  endpoints: {
    /**
     * { [endpoint]: { key, data, error, loading } }
     */
  }
};

const defaultEndpoint = key => ({ data: null, loading: true, error: null, key });

const widgetsReducer = {
  [WIDGETS__INIT_ENDPOINT](state, action) {
    const { endpoint, key } = action.payload;
    return { ...state, endpoints: { ...state.endpoints, [endpoint]: defaultEndpoint(key) } };
  },
  [WIDGETS__SET_ENDPOINT_DATA](state, action) {
    const { endpoint, data } = action.payload;
    const parsedData = Array.isArray(data)
      ? data
      : Object.entries(data).reduce(
          (acc, [key, value]) => ({ ...acc, [camelCase(key)]: value }),
          {}
        );
    return {
      ...state,
      endpoints: {
        ...state.endpoints,
        [endpoint]: {
          ...state.endpoints[endpoint],
          data: parsedData
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
