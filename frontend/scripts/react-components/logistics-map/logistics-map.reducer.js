import createReducer from 'utils/createReducer';
import {
  LOGISTICS_MAP__SET_SELECTED_YEAR,
  LOGISTICS_MAP__SET_LAYER_ACTIVE
} from 'react-components/logistics-map/logistics-map.actions';

const initialState = {
  selectedYear: 2016,
  years: Array(12)
    .fill(2016)
    .map((year, index) => year - index),
  layersStatus: {
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
    return { ...state, layersStatus: { ...state.layersStatus, [layerId]: active } };
  }
};

const logisticsMapReducerTypes = PropTypes => ({
  years: PropTypes.array.isRequired,
  layersStatus: PropTypes.object.isRequired,
  selectedYear: PropTypes.number.isRequired
});

export default createReducer(initialState, logisticsMapReducer, logisticsMapReducerTypes);
