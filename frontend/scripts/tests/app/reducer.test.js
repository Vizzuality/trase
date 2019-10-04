import reducer from 'reducers/app.reducer';
import initialState from 'reducers/app.initial-state';
import { TOOL_LINKS__SET_COLUMNS, setToolColumns } from 'actions/app.actions';

test(TOOL_LINKS__SET_COLUMNS, () => {
  const columns = [
    { id: 1, name: 'MUNICIPALITY' },
    { id: 2, name: 'LOGISTICS HUB' },
    { id: 3, name: 'BIOMES' }
  ];
  const action = setToolColumns(columns);
  const newState = reducer(initialState, action);
  expect(newState).toEqual({
    ...initialState,
    data: {
      ...initialState.data,
      columns: {
        1: columns[0],
        2: columns[1],
        3: columns[2]
      }
    }
  });
});
