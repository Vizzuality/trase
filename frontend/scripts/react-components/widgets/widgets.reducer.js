import createReducer from 'utils/createReducer';
import { WIDGETS__SET_ENDPOINT_DATA } from './widgets.actions';

const initialState = {
  endpoints: {
    /**
     * { [endpoint]: { data, error, loading } }
     */
  }
};

const widgetsReducer = {
  [WIDGETS__SET_ENDPOINT_DATA](state, action) {
    const { endpoint, data } = action.payload;
    return { ...state, endpoints: { ...state.endpoints, [endpoint]: data } };
  }
};

const widgetsReducerTypes = PropTypes => ({
  byEndpoint: PropTypes.object.isRequired
});

export default createReducer(initialState, widgetsReducer, widgetsReducerTypes);
