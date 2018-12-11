import createReducer from 'utils/createReducer';
import { LOGISTICS_MAP__SET_SELECTED_YEAR } from 'react-components/logistics-map/logistics-map.actions';

const initialState = {
  selectedYear: 2013,
  years: Array(10)
    .fill(2005)
    .map((year, index) => year + index)
};

const logisticsMapReducer = {
  [LOGISTICS_MAP__SET_SELECTED_YEAR](state, action) {
    const { selectedYear } = action.payload;
    return { ...state, selectedYear };
  }
};

const logisticsMapReducerTypes = PropTypes => ({
  activeYear: PropTypes.number.isRequired
});

export default createReducer(initialState, logisticsMapReducer, logisticsMapReducerTypes);
