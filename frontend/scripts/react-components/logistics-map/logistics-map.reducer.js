import createReducer from 'utils/createReducer';
import { LOGISTICS_MAP__SET_COMPANIES } from 'react-components/logistics-map/logistics-map.actions';

const initialState = {
  companies: []
};

const logisticsMapReducer = {
  [LOGISTICS_MAP__SET_COMPANIES](state, action) {
    const { companies } = action.payload;
    return { ...state, companies };
  }
};

const logisticsMapReducerTypes = PropTypes => ({
  companies: PropTypes.array
});

export default createReducer(initialState, logisticsMapReducer, logisticsMapReducerTypes);
