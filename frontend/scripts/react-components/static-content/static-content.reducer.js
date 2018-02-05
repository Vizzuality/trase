import { createReducer } from 'store';
import { STATIC_CONTENT__SET_MARKDOWN } from './static-content.actions';

const initialState = {
  markdown: {
    /**
     * { [filename]: content }
     */
  }
};

const homeReducer = {
  [STATIC_CONTENT__SET_MARKDOWN](state, action) {
    const { filename, content } = action.payload;
    return { ...state, markdown: { ...state.markdown, [filename]: content } };
  }
};

export default createReducer(initialState, homeReducer);
