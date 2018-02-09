import PropTypes from 'prop-types';

export function createReducer(initialState, reducers, getTypes) {
  return function reducer(state = initialState, action) {
    const reducerMethod = reducers[action.type];
    const newState = typeof reducerMethod === 'undefined' ? state : reducerMethod(state, action);

    if (getTypes && NODE_ENV_DEV) {
      PropTypes.checkPropTypes(getTypes(PropTypes), newState, 'reducer prop', getTypes.name);
    }
    return newState;
  };
}

export { default as app } from 'reducers/app.reducer';
export { default as tool } from 'reducers/tool.reducer';
export { default as data } from 'reducers/data.reducer';
export { default as home } from 'react-components/home/home.reducer';
export { default as profileRoot } from 'react-components/profile-root/profile-root.reducer';
export { default as newsletter } from 'react-components/shared/newsletter/newsletter.reducer';
export { default as staticContent } from 'react-components/static-content/static-content.reducer';
