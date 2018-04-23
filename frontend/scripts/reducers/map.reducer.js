import { SELECT_BASEMAP } from 'actions/tool.actions';
import { createReducer } from 'store';

export const toolInitialState = {
  selectedMapBasemap: null
};

const toolReducer = {
  [SELECT_BASEMAP](state, action) {
    return Object.assign({}, state, { selectedMapBasemap: action.payload });
  }
};

const toolReducerTypes = PropTypes => ({
  selectedMapBasemap: PropTypes.string
});

export default createReducer(toolInitialState, toolReducer, toolReducerTypes);
