import createReducer from 'utils/createReducer';
import { COUNTRIES_COORDINATES } from 'scripts/countries';
import {
  EXPLORE__SET_TOP_NODES,
  EXPLORE__SET_TOP_NODES_LOADING,
  EXPLORE__SET_SELECTED_TABLE_COLUMN_TYPE
} from './explore.actions';

const initialState = {
  topNodes: {},
  loading: {},
  selectedTableColumnType: 'exporter'
};

const exploreReducer = {
  [EXPLORE__SET_TOP_NODES](state, action) {
    const { topNodesKey, data, columnType, country } = action.payload;
    const nodes = data.targetNodes.map(row => ({
      ...row,
      coordinates: COUNTRIES_COORDINATES[row.geo_id],
      geoId: row.geo_id,
      name: columnType === 'country' && country === row.name ? 'DOMESTIC CONSUMPTION' : row.name
    }));
    return {
      ...state,
      topNodes: { ...state.topNodes, [topNodesKey]: nodes },
      loading: { ...state.loading, [topNodesKey]: false }
    };
  },
  [EXPLORE__SET_TOP_NODES_LOADING](state, action) {
    const { loading, topNodesKey } = action.payload;
    return { ...state, loading: { ...state.loading, [topNodesKey]: loading } };
  },
  [EXPLORE__SET_SELECTED_TABLE_COLUMN_TYPE](state, action) {
    const { columnType } = action.payload;
    return { ...state, selectedTableColumnType: columnType };
  }
};

const exploreReducerTypes = PropTypes => ({
  topNodes: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  selectedTableColumnType: PropTypes.string.isRequired
});

export default createReducer(initialState, exploreReducer, exploreReducerTypes);
