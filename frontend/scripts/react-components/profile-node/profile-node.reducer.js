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

      // TODO the API should have the info on which file to load (if any) per column
      const municipalitiesColumn = columns.find(column => column.name === 'MUNICIPALITY');
      const logisticsHubColumn = columns.find(column => column.name === 'LOGISTICS HUB');
      if (logisticsHubColumn && municipalitiesColumn) {
        logisticsHubColumn.useGeometryFromColumnId = municipalitiesColumn.id;
      }

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
