import { createReducer } from 'store';
import { COUNTRIES_COORDINATES } from 'scripts/countries';
import { WORLD_MAP__SET_TOP_NODES } from './world-map.actions';

const initialState = {
  flows: {}
};

const worldMapReducer = {
  [WORLD_MAP__SET_TOP_NODES](state, action) {
    const { data, contextId } = action.payload;
    const flows = data.targetNodes.map(row => ({
      ...row,
      coordinates: COUNTRIES_COORDINATES[row.geo_id],
      geoId: row.geo_id
    }));
    return { ...state, flows: { ...state.flows, [contextId]: flows } };
  }
};

const worldMapReducerTypes = PropTypes => ({
  flows: PropTypes.object.isRequired
});

export default createReducer(initialState, worldMapReducer, worldMapReducerTypes);
