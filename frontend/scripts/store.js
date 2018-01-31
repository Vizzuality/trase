export function createReducer(initialState, reducers) {
  return function reducer(state = initialState, action) {
    if (typeof reducers[action.type] === 'undefined') return state;
    return reducers[action.type](state, action);
  };
}

export { default as app } from 'reducers/app.reducer';
export { default as tool } from 'reducers/tool.reducer';
export { default as data } from 'reducers/data.reducer';
export { default as home } from 'react-components/home/home.reducer';
export { default as profileRoot } from 'react-components/profile-root/profile-root.reducer';
export { default as newsletter } from 'react-components/shared/newsletter/newsletter.reducer';
export { default as staticContent } from 'react-components/static-content/static-content.reducer';
