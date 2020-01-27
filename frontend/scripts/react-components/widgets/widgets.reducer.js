import createReducer from 'utils/createReducer';
import camelCase from 'lodash/camelCase';
import initialState from './widgets.initial-state';

import {
  WIDGETS__INIT_ENDPOINT,
  WIDGETS__SET_ENDPOINT_DATA,
  WIDGETS__SET_ENDPOINT_ERROR
} from './widgets.actions';

export const defaultEndpoint = key => ({
  data: null,
  loading: true,
  error: null,
  key
});

const widgetsReducer = {
  [WIDGETS__INIT_ENDPOINT](state, action) {
    const { endpoint, key } = action.payload;
    return { ...state, endpoints: { ...state.endpoints, [endpoint]: defaultEndpoint(key) } };
  },
  [WIDGETS__SET_ENDPOINT_DATA](state, action) {
    const { endpoint, data, meta = {} } = action.payload;
    const parseObject = obj =>
      Array.isArray(obj)
        ? obj
        : Object.entries(obj).reduce(
            (acc, [key, value]) => ({ ...acc, [camelCase(key)]: value }),
            {}
          );
    return {
      ...state,
      endpoints: {
        ...state.endpoints,
        [endpoint]: {
          ...state.endpoints[endpoint],
          data: parseObject(data),
          meta: parseObject(meta),
          loading: false
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
          error,
          loading: false
        }
      }
    };
  }
};

const widgetsReducerTypes = PropTypes => ({
  endpoints: PropTypes.objectOf(
    PropTypes.shape({
      error: PropTypes.any,
      key: PropTypes.string.isRequired,
      data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
      loading: PropTypes.bool.isRequired
    })
  ).isRequired
});

export default createReducer(initialState, widgetsReducer, widgetsReducerTypes);
