import reducer from 'reducers/app.reducer';
import initialState from 'reducers/app.initial-state';
import {
  APP__SET_COLUMNS,
  setColumns,
  APP__SET_COLUMNS_LOADING,
  setColumnsLoading
} from 'actions/app.actions';

test(APP__SET_COLUMNS, () => {
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

test(APP__SET_COLUMNS_LOADING, () => {
  const action = setColumnsLoading(true);
  const newState = reducer(initialState, action);
  expect(newState).toEqual({
    ...initialState,
    loading: { ...initialState.loading, columns: true }
  });
});
