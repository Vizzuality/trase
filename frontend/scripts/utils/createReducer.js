import PropTypes from 'prop-types';

export default function createReducer(initialState, reducers, getTypes) {
  return function reducer(state = initialState, action) {
    const reducerMethod = reducers[action.type];
    const newState = typeof reducerMethod === 'undefined' ? state : reducerMethod(state, action);

    if (NODE_ENV_DEV === true) {
      if (getTypes) {
        PropTypes.checkPropTypes(getTypes(PropTypes), newState, 'reducer prop', getTypes.name);
      }
    }
    return newState;
  };
}
