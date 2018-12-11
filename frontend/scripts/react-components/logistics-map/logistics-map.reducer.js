import createReducer from 'utils/createReducer';
import {
  LOGISTICS_MAP__SET_SELECTED_YEAR,
  LOGISTICS_MAP__SET_LAYER_ACTIVE
} from 'react-components/logistics-map/logistics-map.actions';

const initialState = {
  selectedYear: 2013,
  years: Array(10)
    .fill(2005)
    .map((year, index) => year + index),
  layers: {
    // [id]:[active]
  }
};

const logisticsMapReducer = {
  [LOGISTICS_MAP__SET_SELECTED_YEAR](state, action) {
    const { selectedYear } = action.payload;
    return { ...state, selectedYear };
  },
  [LOGISTICS_MAP__SET_LAYER_ACTIVE](state, action) {
    const { layerId, active } = action.payload;
    return { ...state, layers: { ...state.layers, [layerId]: active } };
  }
};

const logisticsMapReducerTypes = PropTypes => ({
  years: PropTypes.array.isRequired,
  layers: PropTypes.object.isRequired,
  selectedYear: PropTypes.number.isRequired
});

export default createReducer(initialState, logisticsMapReducer, logisticsMapReducerTypes);
