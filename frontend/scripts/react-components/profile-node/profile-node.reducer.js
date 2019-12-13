import {
  PROFILE_NODE__SET_COLUMNS,
  PROFILE_NODE__SET_COLUMNS_LOADING
} from 'react-components/profile-node/profile-node.actions';
import createReducer from 'utils/createReducer';
import initialState from 'react-components/profile-node/profile-node-initial-state';

import immer from 'immer';

const profileNodeReducer = {
  [PROFILE_NODE__SET_COLUMNS_LOADING](state, action) {
    const { loading } = action.payload;
    return { ...state, loading: { ...state.loading, columns: loading } };
  },
  [PROFILE_NODE__SET_COLUMNS](state, action) {
    return immer(state, draft => {
      const { columns } = action.payload;

      draft.columns = {};
      columns.forEach(column => {
        draft.columns[column.id] = column;
      });
    });
  }
};

const profileNodeReducerTypes = PropTypes => ({
  columns: PropTypes.array
});

export default createReducer(initialState, profileNodeReducer, profileNodeReducerTypes);
