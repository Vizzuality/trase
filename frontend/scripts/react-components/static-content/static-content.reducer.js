import createReducer from 'utils/createReducer';
import initialState from './static-content.initial-state';
import { STATIC_CONTENT__SET_MARKDOWN } from './static-content.actions';

const staticContentReducer = {
  [STATIC_CONTENT__SET_MARKDOWN](state, action) {
    const { filename, content } = action.payload;
    return { ...state, markdown: { ...state.markdown, [filename]: content } };
  }
};

const staticContentReducerTypes = PropTypes => ({
  markdown: PropTypes.object.isRequired
});

export default createReducer(initialState, staticContentReducer, staticContentReducerTypes);
