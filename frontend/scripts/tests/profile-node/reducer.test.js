import reducer from 'react-components/profile-node/profile-node.reducer';
import initialState from 'react-components/profile-node/profile-node-initial-state';
import {
  PROFILE_NODE__SET_COLUMNS,
  setColumns,
  PROFILE_NODE__SET_COLUMNS_LOADING,
  setColumnsLoading
} from 'react-components/profile-node/profile-node.actions';

test(PROFILE_NODE__SET_COLUMNS, () => {
  const columns = [
    { id: 1, name: 'MUNICIPALITY' },
    { id: 2, name: 'LOGISTICS HUB' },
    { id: 3, name: 'BIOMES' }
  ];
  const action = setColumns(columns);
  const newState = reducer(initialState, action);
  expect(newState).toEqual({
    ...initialState,
    columns: {
      1: columns[0],
      2: columns[1],
      3: columns[2]
    }
  });
});

test(PROFILE_NODE__SET_COLUMNS_LOADING, () => {
  const action = setColumnsLoading(true);
  const newState = reducer(initialState, action);
  expect(newState).toEqual({
    ...initialState,
    loading: { ...initialState.loading, columns: true }
  });
});
