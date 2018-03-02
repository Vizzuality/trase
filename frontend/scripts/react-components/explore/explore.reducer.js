import { createReducer } from 'store';
import { COUNTRIES_COORDINATES } from 'scripts/countries';
import { EXPLORE__SET_TOP_NODES } from './explore.actions';

const initialState = {
  topNodes: {}
};

const exploreReducer = {
  [EXPLORE__SET_TOP_NODES](state, action) {
    const { topNodesKey, data } = action.payload;
    const nodes = data.targetNodes.map(row => ({
      ...row,
      coordinates: COUNTRIES_COORDINATES[row.geo_id],
      geoId: row.geo_id
    }));
    return { ...state, topNodes: { ...state.topNodes, [topNodesKey]: nodes } };
  }
};

const exploreReducerTypes = PropTypes => ({
  topNodes: PropTypes.object.isRequired
});

export default createReducer(initialState, exploreReducer, exploreReducerTypes);
