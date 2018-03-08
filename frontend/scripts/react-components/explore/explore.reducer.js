import { createReducer } from 'store';
import { COUNTRIES_COORDINATES } from 'scripts/countries';
import { EXPLORE__SET_TOP_NODES, EXPLORE__SET_SELECTED_TABLE_COLUMN } from './explore.actions';

const initialState = {
  topNodes: {},
  selectedTableColumn: 6
};

const exploreReducer = {
  [EXPLORE__SET_TOP_NODES](state, action) {
    const { topNodesKey, data, columnId, country } = action.payload;
    const nodes = data.targetNodes.map(row => ({
      ...row,
      coordinates: COUNTRIES_COORDINATES[row.geo_id],
      geoId: row.geo_id,
      name: columnId === 8 && country === row.name ? 'DOMESTIC CONSUMPTION' : row.name
    }));
    return { ...state, topNodes: { ...state.topNodes, [topNodesKey]: nodes } };
  },
  [EXPLORE__SET_SELECTED_TABLE_COLUMN](state, action) {
    const { column } = action.payload;
    return { ...state, selectedTableColumn: column };
  }
};

const exploreReducerTypes = PropTypes => ({
  topNodes: PropTypes.object.isRequired,
  selectedTableColumn: PropTypes.number.isRequired
});

export default createReducer(initialState, exploreReducer, exploreReducerTypes);
